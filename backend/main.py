"""
FastAPI Backend for SIH 2026 - Problem Statement 26003:
Cognitive Gaming and Memory Assistance Platform for Elderly Dementia Patients in NER.

Core Module: Adaptive Memory Recall Game (Phase 1)
"""

import uuid
import random
from datetime import datetime
from typing import Optional, List

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .models import (
    GameStartRequest,
    GameStartResponse,
    GameSubmitRequest,
    GameSubmitResponse,
    PatientHistoryResponse,
    ObjectItem,
    VoiceTranscribeResponse
)
from .data.objects_ner import CULTURAL_OBJECTS, LEVEL_CONFIG
from .services.adaptive_engine import AdaptiveEngine
from .services.storage_service import StorageService, init_db
from .services.whisper_service import WhisperVoiceService

# Initialize SQLite database schema
init_db()

app = FastAPI(
    title="MindCare NER - Cognitive Memory Game API",
    description="Adaptive Memory Recall Game Backend for Elderly Dementia Patients in North Eastern Region (Phase 1)",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows localhost:5173, etc.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "MindCare NER - Cognitive Module API",
        "version": "1.0.0",
        "whisperReady": WhisperVoiceService.is_available()
    }

@app.post("/api/game/start", response_model=GameStartResponse)
def start_game_round(req: GameStartRequest):
    """
    Initializes a new game session.
    Selects culturally familiar target objects and distractor candidates
    based on the patient's adaptive difficulty level.
    """
    patient_id = req.patientId or "P001"

    # Determine difficulty level: requested override, or patient's saved level, default 1
    if req.requestedLevel and 1 <= req.requestedLevel <= 4:
        level = req.requestedLevel
    else:
        level = StorageService.get_patient_level(patient_id)
        if not (1 <= level <= 4):
            level = 1

    config = LEVEL_CONFIG.get(level, LEVEL_CONFIG[1])
    target_count = config["objects_count"]
    distractor_count = config["distractors_count"]
    viewing_seconds = config["viewing_seconds"]

    # Filter/sample objects matching the level requirements
    # Level 1: visually distinct items
    # Level 3 & 4: include similar items
    all_objects = list(CULTURAL_OBJECTS)

    if level == 1:
        distinct_pool = [o for o in all_objects if o.get("visual_distinctiveness") == "high"]
        if len(distinct_pool) < target_count:
            distinct_pool = all_objects
        targets = random.sample(distinct_pool, min(target_count, len(distinct_pool)))
    elif level in (3, 4):
        # Prioritize items with similarity clusters to increase cognitive discernment
        similar_pool = [o for o in all_objects if o.get("visual_distinctiveness") in ("moderate", "similar")]
        remaining_pool = [o for o in all_objects if o not in similar_pool]
        sample_pool = similar_pool + remaining_pool
        targets = random.sample(sample_pool, min(target_count, len(sample_pool)))
    else:
        targets = random.sample(all_objects, min(target_count, len(all_objects)))

    target_ids = {t["id"] for t in targets}
    remaining_distractors = [o for o in all_objects if o["id"] not in target_ids]
    distractors = random.sample(remaining_distractors, min(distractor_count, len(remaining_distractors)))

    # Combined candidate pool shuffled for selection
    selection_pool = targets + distractors
    random.shuffle(selection_pool)

    session_id = f"session_{uuid.uuid4().hex[:10]}"

    return GameStartResponse(
        sessionId=session_id,
        patientId=patient_id,
        difficultyLevel=level,
        levelName=config["name"],
        viewingSeconds=viewing_seconds,
        targetObjects=[ObjectItem(**item) for item in targets],
        selectionPool=[ObjectItem(**item) for item in selection_pool],
        totalTargetCount=len(targets),
        totalPoolCount=len(selection_pool),
        instructions=f"Remember these {len(targets)} objects. You have {viewing_seconds} seconds."
    )

@app.post("/api/game/submit", response_model=GameSubmitResponse)
def submit_game_round(req: GameSubmitRequest):
    """
    Submits player answers.
    The backend computes accurate recall metrics, response composure,
    mistakes penalty, hints penalty, overall performance score,
    and determines the next difficulty level.
    Saves record to database.
    """
    evaluation = AdaptiveEngine.evaluate_gameplay(
        difficulty_level=req.difficultyLevel,
        target_ids=req.targetObjectIds,
        selected_ids=req.selectedObjectIds,
        response_time_seconds=req.responseTime,
        attempts=req.attempts,
        hints_used=req.hintsUsed
    )

    timestamp = datetime.utcnow().isoformat() + "Z"

    # Assemble complete session payload
    session_data = {
        "sessionId": req.sessionId,
        "patientId": req.patientId,
        "gameType": "memory_recall",
        "difficultyLevel": req.difficultyLevel,
        "objectsShown": evaluation["objectsShown"],
        "correctAnswers": evaluation["correctAnswers"],
        "incorrectAnswers": evaluation["incorrectAnswers"],
        "accuracy": evaluation["accuracy"],
        "responseTime": evaluation["responseTime"],
        "attempts": evaluation["attempts"],
        "hintsUsed": evaluation["hintsUsed"],
        "performanceScore": evaluation["performanceScore"],
        "nextDifficultyLevel": evaluation["nextDifficultyLevel"],
        "timestamp": timestamp
    }

    # Persist in SQLite
    StorageService.save_session(session_data)

    return GameSubmitResponse(
        sessionId=req.sessionId,
        patientId=req.patientId,
        gameType="memory_recall",
        difficultyLevel=req.difficultyLevel,
        objectsShown=evaluation["objectsShown"],
        correctAnswers=evaluation["correctAnswers"],
        incorrectAnswers=evaluation["incorrectAnswers"],
        missedAnswers=evaluation["missedAnswers"],
        correctCount=evaluation["correctCount"],
        incorrectCount=evaluation["incorrectCount"],
        missedCount=evaluation["missedCount"],
        accuracy=evaluation["accuracy"],
        responseTime=evaluation["responseTime"],
        attempts=evaluation["attempts"],
        hintsUsed=evaluation["hintsUsed"],
        performanceScore=evaluation["performanceScore"],
        nextDifficultyLevel=evaluation["nextDifficultyLevel"],
        adaptiveAction=evaluation["adaptiveAction"],
        feedbackMessage=evaluation["feedbackMessage"],
        scoreBreakdown=evaluation["scoreBreakdown"],
        timestamp=timestamp
    )

@app.get("/api/patient/{patientId}/history", response_model=PatientHistoryResponse)
def get_patient_history(patientId: str):
    """
    Retrieves longitudinal gameplay records for patient.
    """
    history = StorageService.get_patient_history(patientId)
    return history

@app.get("/api/patient/{patientId}/ml-dataset")
def export_ml_dataset(patientId: str):
    """
    Exports structured gameplay rows for machine learning pipeline.
    Suitable for training a future Random Forest regressor or classifier.
    """
    dataset = StorageService.get_ml_dataset(patientId)
    return {
        "patientId": patientId,
        "totalRecords": len(dataset),
        "columns": [
            "difficulty_level", "num_targets_shown", "num_correct",
            "num_incorrect", "accuracy_pct", "response_time_seconds",
            "attempts_count", "hints_used", "performance_score", "target_next_level"
        ],
        "records": dataset,
        "note": "Prepared for supervised training of personalization models (e.g. Random Forest). No synthetic clinical diagnosis claims."
    }

class TextVoiceRequest(BaseModel):
    text: str

@app.post("/api/voice/transcribe-text", response_model=VoiceTranscribeResponse)
def transcribe_text_command(req: TextVoiceRequest):
    """
    Command recognition from text or Web Speech API input.
    Maps patient speech to application intents.
    """
    result = WhisperVoiceService.parse_command_from_text(req.text)
    return VoiceTranscribeResponse(**result)

@app.post("/api/voice/transcribe", response_model=VoiceTranscribeResponse)
async def transcribe_audio_file(file: UploadFile = File(...)):
    """
    Transcribes audio file using Hugging Face openai/whisper-small architecture.
    """
    audio_bytes = await file.read()
    result = WhisperVoiceService.transcribe_audio_bytes(audio_bytes, file.filename or "audio.wav")
    return VoiceTranscribeResponse(
        transcription=result.get("transcription", ""),
        detectedCommand=result.get("detectedCommand"),
        confidence=result.get("confidence", 0.9),
        modelUsed=result.get("modelUsed", "openai/whisper-small")
    )
