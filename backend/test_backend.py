"""
Automated unit and integration test suite for MindCare NER Cognitive Game Backend.
"""

import sys
import os

# Ensure backend directory is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.data.objects_ner import CULTURAL_OBJECTS, LEVEL_CONFIG
from backend.services.adaptive_engine import AdaptiveEngine
from backend.services.storage_service import StorageService, init_db
from backend.services.whisper_service import WhisperVoiceService
from fastapi.testclient import TestClient
from backend.main import app

def test_cultural_objects_and_levels():
    print("Testing Cultural Objects and Level Config...")
    assert len(CULTURAL_OBJECTS) >= 15, "Should have at least 15 culturally familiar objects"
    assert len(LEVEL_CONFIG) == 4, "Should have exactly 4 difficulty levels"
    assert LEVEL_CONFIG[1]["objects_count"] == 4 and LEVEL_CONFIG[1]["viewing_seconds"] == 5
    assert LEVEL_CONFIG[2]["objects_count"] == 6 and LEVEL_CONFIG[2]["viewing_seconds"] == 5
    assert LEVEL_CONFIG[3]["objects_count"] == 8 and LEVEL_CONFIG[3]["viewing_seconds"] == 4
    assert LEVEL_CONFIG[4]["objects_count"] == 10 and LEVEL_CONFIG[4]["viewing_seconds"] == 3
    print("[OK] Object catalog and difficulty level specifications verified.")

def test_adaptive_engine():
    print("Testing Adaptive Engine Logic...")

    # Case 1: High performance (100% accuracy, quick response) -> should increase difficulty
    eval_high = AdaptiveEngine.evaluate_gameplay(
        difficulty_level=1,
        target_ids=["item1", "item2", "item3", "item4"],
        selected_ids=["item1", "item2", "item3", "item4"],
        response_time_seconds=12.0,
        attempts=4,
        hints_used=0
    )
    assert eval_high["accuracy"] == 100.0
    assert eval_high["performanceScore"] >= 80.0
    assert eval_high["nextDifficultyLevel"] == 2
    assert eval_high["adaptiveAction"] == "increase"
    print(f"[OK] High performance test passed: Score {eval_high['performanceScore']} -> Next Level {eval_high['nextDifficultyLevel']}")

    # Case 2: Moderate performance (75% accuracy) -> should maintain difficulty
    eval_mod = AdaptiveEngine.evaluate_gameplay(
        difficulty_level=2,
        target_ids=["item1", "item2", "item3", "item4", "item5", "item6"],
        selected_ids=["item1", "item2", "item3", "item4"], # 4/6 correct = 66.7%
        response_time_seconds=22.0,
        attempts=4,
        hints_used=1
    )
    assert 60.0 <= eval_mod["performanceScore"] < 80.0
    assert eval_mod["nextDifficultyLevel"] == 2
    assert eval_mod["adaptiveAction"] == "maintain"
    print(f"[OK] Moderate performance test passed: Score {eval_mod['performanceScore']} -> Next Level {eval_mod['nextDifficultyLevel']}")

    # Case 3: Low performance (multiple mistakes and low accuracy) -> should decrease difficulty
    eval_low = AdaptiveEngine.evaluate_gameplay(
        difficulty_level=3,
        target_ids=["i1", "i2", "i3", "i4", "i5", "i6", "i7", "i8"],
        selected_ids=["i1", "wrong1", "wrong2", "wrong3"], # 1/8 correct, 3 false positives
        response_time_seconds=45.0,
        attempts=4,
        hints_used=2
    )
    assert eval_low["performanceScore"] < 40.0
    assert eval_low["nextDifficultyLevel"] == 2
    assert eval_low["adaptiveAction"] == "decrease"
    print(f"[OK] Low performance test passed: Score {eval_low['performanceScore']} -> Next Level {eval_low['nextDifficultyLevel']}")

def test_whisper_command_mapping():
    print("Testing Whisper Command Mapping...")
    cmd1 = WhisperVoiceService.map_transcription_to_command("Please start game now")
    assert cmd1 == "start_game"
    cmd2 = WhisperVoiceService.map_transcription_to_command("can you give me a hint")
    assert cmd2 == "hint"
    cmd3 = WhisperVoiceService.map_transcription_to_command("I am finished submit")
    assert cmd3 == "submit"
    cmd4 = WhisperVoiceService.map_transcription_to_command("go to home screen")
    assert cmd4 == "home"
    print("[OK] Voice command mapping verified.")

def test_api_integration():
    print("Testing FastAPI Endpoints directly...")
    from backend.main import (
        health_check,
        start_game_round,
        submit_game_round,
        get_patient_history,
        export_ml_dataset,
        transcribe_text_command
    )
    from backend.models import GameStartRequest, GameSubmitRequest, TextVoiceRequest

    # 1. Health check
    res_health = health_check()
    assert res_health["status"] == "online"
    print("[OK] Health check endpoint verified.")

    # 2. Game Start (Level 1)
    start_req = GameStartRequest(patientId="P001", requestedLevel=1)
    start_resp = start_game_round(start_req)
    assert start_resp.difficultyLevel == 1
    assert len(start_resp.targetObjects) == 4
    assert start_resp.viewingSeconds == 5
    assert len(start_resp.selectionPool) >= 8
    print("[OK] /api/game/start endpoint verified.")

    # 3. Game Submit
    target_ids = [t.id for t in start_resp.targetObjects]
    submit_req = GameSubmitRequest(
        sessionId=start_resp.sessionId,
        patientId="P001",
        difficultyLevel=1,
        selectedObjectIds=target_ids,
        targetObjectIds=target_ids,
        responseTime=11.2,
        attempts=4,
        hintsUsed=0
    )
    submit_resp = submit_game_round(submit_req)
    assert submit_resp.accuracy == 100.0
    assert submit_resp.correctCount == 4
    assert submit_resp.performanceScore >= 80.0
    assert submit_resp.nextDifficultyLevel == 2
    print(f"[OK] /api/game/submit endpoint verified (Score: {submit_resp.performanceScore}, Next Level: {submit_resp.nextDifficultyLevel}).")

    # 4. Patient History
    hist_resp = get_patient_history("P001")
    assert hist_resp["patientId"] == "P001"
    assert hist_resp["totalSessions"] >= 1
    assert hist_resp["currentLevel"] == 2
    print(f"[OK] /api/patient/P001/history verified (Total sessions: {hist_resp['totalSessions']}).")

    # 5. ML Dataset Export
    ml_resp = export_ml_dataset("P001")
    assert ml_resp["totalRecords"] >= 1
    assert "accuracy_pct" in ml_resp["columns"]
    print(f"[OK] /api/patient/P001/ml-dataset verified (Rows exported: {ml_resp['totalRecords']}).")

    # 6. Voice command parsing
    voice_resp = transcribe_text_command(TextVoiceRequest(text="start game please"))
    assert voice_resp.detectedCommand == "start_game"
    print("[OK] /api/voice/transcribe-text verified.")

    print("[OK] All FastAPI endpoints verified successfully!")

if __name__ == "__main__":
    test_cultural_objects_and_levels()
    test_adaptive_engine()
    test_whisper_command_mapping()
    test_api_integration()
    print("\nALL BACKEND TESTS PASSED SUCCESSFULLY!")

