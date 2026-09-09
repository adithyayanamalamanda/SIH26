"""
Pydantic data models for the Cognitive Memory Game API.
Strict adherence to problem statement 26003 requirements.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

class ObjectItem(BaseModel):
    id: str
    label: str
    regional_label: Optional[str] = None
    category: Optional[str] = None
    emoji: str
    icon_color: Optional[str] = "#3B82F6"
    similarity_group: Optional[str] = None
    visual_distinctiveness: Optional[str] = "high"

class GameStartRequest(BaseModel):
    patientId: str = Field(default="P001", description="Identifier of the patient")
    requestedLevel: Optional[int] = Field(default=None, ge=1, le=4, description="Optional override for difficulty level")

class GameStartResponse(BaseModel):
    sessionId: str
    patientId: str
    difficultyLevel: int
    levelName: str
    viewingSeconds: int
    targetObjects: List[ObjectItem]
    selectionPool: List[ObjectItem]
    totalTargetCount: int
    totalPoolCount: int
    instructions: str

class GameSubmitRequest(BaseModel):
    sessionId: str
    patientId: str = Field(default="P001")
    difficultyLevel: int = Field(ge=1, le=4)
    selectedObjectIds: List[str] = Field(..., description="IDs of objects picked by the patient")
    targetObjectIds: List[str] = Field(..., description="IDs of objects originally shown")
    responseTime: float = Field(..., ge=0.0, description="Time in seconds taken during selection")
    attempts: int = Field(default=1, ge=1, description="Number of selection clicks/toggles made")
    hintsUsed: int = Field(default=0, ge=0, description="Number of hints used")

class ScoreBreakdown(BaseModel):
    accuracyScore: float
    timeScore: float
    mistakePenalty: float
    hintPenalty: float
    rawScore: float
    finalScore: float
    explanation: str

class GameSubmitResponse(BaseModel):
    sessionId: str
    patientId: str
    gameType: str = "memory_recall"
    difficultyLevel: int
    objectsShown: List[str]
    correctAnswers: List[str]
    incorrectAnswers: List[str]
    missedAnswers: List[str]
    correctCount: int
    incorrectCount: int
    missedCount: int
    accuracy: float
    responseTime: float
    attempts: int
    hintsUsed: int
    performanceScore: float
    nextDifficultyLevel: int
    adaptiveAction: str  # "increase", "maintain", "decrease"
    feedbackMessage: str
    scoreBreakdown: ScoreBreakdown
    timestamp: str

class GameSessionRecord(BaseModel):
    id: Optional[int] = None
    sessionId: str
    patientId: str
    gameType: str
    difficultyLevel: int
    objectsShown: List[str]
    correctAnswers: List[str]
    incorrectAnswers: List[str]
    accuracy: float
    responseTime: float
    attempts: int
    hintsUsed: int
    performanceScore: float
    nextDifficultyLevel: int
    timestamp: str

class PatientHistoryResponse(BaseModel):
    patientId: str
    currentLevel: int
    totalSessions: int
    averageAccuracy: float
    averageResponseTime: float
    averageScore: float
    sessions: List[GameSessionRecord]

class TextVoiceRequest(BaseModel):
    text: str

class VoiceTranscribeResponse(BaseModel):
    transcription: str
    detectedCommand: Optional[str] = None  # "start_game", "hint", "home", "repeat"
    confidence: float
    modelUsed: str = "openai/whisper-small"
