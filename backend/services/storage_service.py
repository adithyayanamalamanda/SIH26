"""
Storage Service for persisting GameSession data in SQLite,
managing patient progress, and producing clean datasets for future ML model training.
"""

import sqlite3
import json
import os
from datetime import datetime
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "cognitive_game.db")

def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS game_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT UNIQUE NOT NULL,
                patient_id TEXT NOT NULL,
                game_type TEXT NOT NULL,
                difficulty_level INTEGER NOT NULL,
                objects_shown TEXT NOT NULL,
                correct_answers TEXT NOT NULL,
                incorrect_answers TEXT NOT NULL,
                accuracy REAL NOT NULL,
                response_time REAL NOT NULL,
                attempts INTEGER NOT NULL,
                hints_used INTEGER NOT NULL,
                performance_score REAL NOT NULL,
                next_difficulty_level INTEGER NOT NULL,
                timestamp TEXT NOT NULL
            )
        """)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS patient_profiles (
                patient_id TEXT PRIMARY KEY,
                name TEXT,
                current_level INTEGER DEFAULT 1,
                last_updated TEXT
            )
        """)
        # Initialize default mock patient P001 if missing
        cursor.execute("""
            INSERT OR IGNORE INTO patient_profiles (patient_id, name, current_level, last_updated)
            VALUES ('P001', 'Elderly Patient (NER Cohort)', 1, datetime('now'))
        """)
        conn.commit()

class StorageService:
    @staticmethod
    def save_session(session_data: Dict[str, Any]) -> int:
        init_db()
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO game_sessions (
                    session_id, patient_id, game_type, difficulty_level,
                    objects_shown, correct_answers, incorrect_answers,
                    accuracy, response_time, attempts, hints_used,
                    performance_score, next_difficulty_level, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                session_data["sessionId"],
                session_data["patientId"],
                session_data.get("gameType", "memory_recall"),
                session_data["difficultyLevel"],
                json.dumps(session_data["objectsShown"]),
                json.dumps(session_data["correctAnswers"]),
                json.dumps(session_data["incorrectAnswers"]),
                session_data["accuracy"],
                session_data["responseTime"],
                session_data["attempts"],
                session_data["hintsUsed"],
                session_data["performanceScore"],
                session_data["nextDifficultyLevel"],
                session_data["timestamp"]
            ))
            row_id = cursor.lastrowid

            # Update patient profile current level to the newly calculated next difficulty
            cursor.execute("""
                INSERT INTO patient_profiles (patient_id, name, current_level, last_updated)
                VALUES (?, 'Elderly Patient', ?, datetime('now'))
                ON CONFLICT(patient_id) DO UPDATE SET
                    current_level = excluded.current_level,
                    last_updated = datetime('now')
            """, (session_data["patientId"], session_data["nextDifficultyLevel"]))

            conn.commit()
            return row_id

    @staticmethod
    def get_patient_level(patient_id: str = "P001") -> int:
        init_db()
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT current_level FROM patient_profiles WHERE patient_id = ?", (patient_id,))
            row = cursor.fetchone()
            if row:
                return row[0]
            return 1

    @staticmethod
    def get_patient_history(patient_id: str = "P001") -> Dict[str, Any]:
        init_db()
        with sqlite3.connect(DB_PATH) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("""
                SELECT * FROM game_sessions
                WHERE patient_id = ?
                ORDER BY timestamp DESC
            """, (patient_id,))
            rows = cursor.fetchall()

            sessions = []
            total_accuracy = 0.0
            total_time = 0.0
            total_score = 0.0

            for r in rows:
                rec = {
                    "id": r["id"],
                    "sessionId": r["session_id"],
                    "patientId": r["patient_id"],
                    "gameType": r["game_type"],
                    "difficultyLevel": r["difficulty_level"],
                    "objectsShown": json.loads(r["objects_shown"]),
                    "correctAnswers": json.loads(r["correct_answers"]),
                    "incorrectAnswers": json.loads(r["incorrect_answers"]),
                    "accuracy": r["accuracy"],
                    "responseTime": r["response_time"],
                    "attempts": r["attempts"],
                    "hintsUsed": r["hints_used"],
                    "performanceScore": r["performance_score"],
                    "nextDifficultyLevel": r["next_difficulty_level"],
                    "timestamp": r["timestamp"]
                }
                sessions.append(rec)
                total_accuracy += rec["accuracy"]
                total_time += rec["responseTime"]
                total_score += rec["performanceScore"]

            count = len(sessions)
            current_level = StorageService.get_patient_level(patient_id)

            return {
                "patientId": patient_id,
                "currentLevel": current_level,
                "totalSessions": count,
                "averageAccuracy": round(total_accuracy / count, 1) if count > 0 else 0.0,
                "averageResponseTime": round(total_time / count, 2) if count > 0 else 0.0,
                "averageScore": round(total_score / count, 1) if count > 0 else 0.0,
                "sessions": sessions
            }

    @staticmethod
    def get_ml_dataset(patient_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Extract gameplay records as tabular rows ready for Random Forest training.
        """
        init_db()
        with sqlite3.connect(DB_PATH) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            if patient_id:
                cursor.execute("SELECT * FROM game_sessions WHERE patient_id = ? ORDER BY id ASC", (patient_id,))
            else:
                cursor.execute("SELECT * FROM game_sessions ORDER BY id ASC")
            rows = cursor.fetchall()

            dataset = []
            for r in rows:
                shown = json.loads(r["objects_shown"])
                correct = json.loads(r["correct_answers"])
                incorrect = json.loads(r["incorrect_answers"])
                dataset.append({
                    "session_id": r["session_id"],
                    "patient_id": r["patient_id"],
                    "difficulty_level": r["difficulty_level"],
                    "num_targets_shown": len(shown),
                    "num_correct": len(correct),
                    "num_incorrect": len(incorrect),
                    "accuracy_pct": r["accuracy"],
                    "response_time_seconds": r["response_time"],
                    "attempts_count": r["attempts"],
                    "hints_used": r["hints_used"],
                    "performance_score": r["performance_score"],
                    "target_next_level": r["next_difficulty_level"],
                    "timestamp": r["timestamp"]
                })
            return dataset
