"""
Adaptive Difficulty Engine for Cognitive Memory Recall Game.

Problem Statement 26003: Cognitive Gaming Platform for Elderly Dementia Patients.

Transparent, auditable rule-based adaptive logic based on clinical cognitive
assessment principles (recall accuracy, processing speed/latency, false positive errors,
and cueing/hints dependencies).

Designed as an isolated, modular service so it can later be swapped with or benchmarked
against a supervised Machine Learning model (e.g. Random Forest classifier/regressor).
"""

from typing import Dict, Any, List, Tuple
from ..data.objects_ner import LEVEL_CONFIG

class AdaptiveEngine:
    """
    Computes performance score and determines adaptive progression.
    Guarantees transparent calculation without fabricating synthetic ML models.
    """

    # Baseline comfortable response times (seconds) per difficulty level for elderly users
    BASELINE_TIME_BUDGET = {
        1: 20.0,  # 4 items pool
        2: 25.0,  # 6 items pool
        3: 30.0,  # 8 items pool
        4: 35.0   # 10 items pool
    }

    @classmethod
    def evaluate_gameplay(
        cls,
        difficulty_level: int,
        target_ids: List[str],
        selected_ids: List[str],
        response_time_seconds: float,
        attempts: int = 1,
        hints_used: int = 0
    ) -> Dict[str, Any]:
        """
        Evaluate memory recall round and compute performance score and next difficulty.

        Returns detailed evaluation dictionary matching GameSubmitResponse structure.
        """
        target_set = set(target_ids)
        selected_set = set(selected_ids)

        # 1. Answer classification
        correct_set = target_set.intersection(selected_set)
        incorrect_set = selected_set.difference(target_set)  # False positives
        missed_set = target_set.difference(selected_set)     # False negatives

        target_count = max(len(target_set), 1)
        correct_count = len(correct_set)
        incorrect_count = len(incorrect_set)
        missed_count = len(missed_set)

        # 2. Base Accuracy Score (0 - 100)
        # Proportion of target objects successfully recalled
        accuracy_pct = round((correct_count / target_count) * 100.0, 1)

        # 3. Response Time Efficiency Score (0 - 100)
        # We give full score if within baseline comfortable time budget.
        # Gradual attenuation if taking longer, but never punitive for elderly contemplation.
        budget = cls.BASELINE_TIME_BUDGET.get(difficulty_level, 25.0)
        if response_time_seconds <= budget:
            # Full credit for comfortable completion within baseline
            time_score = 100.0
        elif response_time_seconds <= budget * 1.5:
            time_score = 100.0 - ((response_time_seconds - budget) / (budget * 0.5)) * 20.0
        else:
            time_score = max(50.0, 80.0 - ((response_time_seconds - budget * 1.5) / budget) * 30.0)

        # 4. Composite Performance Score Calculation
        # Base anchor: Accuracy percentage (0 - 100)
        base_accuracy = accuracy_pct

        # Processing speed factor:
        # If within comfortable baseline: +5 bonus points
        # If moderate delay: 0 adjustment
        # If significant delay: -5 to -15 adjustment
        if response_time_seconds <= budget:
            speed_adjustment = 5.0
        elif response_time_seconds <= budget * 1.5:
            speed_adjustment = 0.0
        else:
            speed_adjustment = -min(15.0, ((response_time_seconds - budget * 1.5) / budget) * 15.0)

        # Penalties:
        # False positives (picking wrong distractors) indicate confusion / confabulation
        mistake_penalty = min(incorrect_count * 6.0, 25.0)
        # Cueing dependency (hints requested)
        hint_penalty = min(hints_used * 4.0, 15.0)

        # Clean completion bonus: 100% recall with 0 errors
        completion_bonus = 5.0 if (correct_count == target_count and incorrect_count == 0) else 0.0

        raw_score = base_accuracy + speed_adjustment + completion_bonus - mistake_penalty - hint_penalty
        final_score = round(max(0.0, min(100.0, raw_score)), 1)

        # 6. Adaptive Progression Rules (per prompt requirements)
        # Score >= 80: increase difficulty by one level
        # Score 60-79: keep same level
        # Score 40-59: decrease difficulty slightly
        # Score < 40: decrease difficulty
        if final_score >= 80.0:
            next_level = min(difficulty_level + 1, 4)
            action = "increase"
            feedback = "Outstanding recall! You are ready for the next level."
        elif final_score >= 60.0:
            next_level = difficulty_level
            action = "maintain"
            feedback = "Great work! You maintained consistent focus and recall."
        elif final_score >= 40.0:
            next_level = max(difficulty_level - 1, 1)
            action = "decrease"
            feedback = "Good effort! We adjusted to a more comfortable pace for the next round."
        else:
            next_level = max(difficulty_level - 1, 1)
            action = "decrease"
            feedback = "Thank you for playing! Let's practice with fewer items at a relaxed pace."

        score_breakdown = {
            "accuracyScore": accuracy_pct,
            "timeScore": round(speed_adjustment, 1),
            "mistakePenalty": round(mistake_penalty, 1),
            "hintPenalty": round(hint_penalty, 1),
            "rawScore": round(raw_score, 1),
            "finalScore": final_score,
            "explanation": (
                f"Accuracy {accuracy_pct}% ({correct_count}/{target_count} recalled), "
                f"Speed adjustment: {speed_adjustment:+.1f} pts ({response_time_seconds:.1f}s), "
                f"Mistakes: -{mistake_penalty} pts, Hints: -{hint_penalty} pts."
            )
        }

        return {
            "difficultyLevel": difficulty_level,
            "objectsShown": list(target_set),
            "correctAnswers": list(correct_set),
            "incorrectAnswers": list(incorrect_set),
            "missedAnswers": list(missed_set),
            "correctCount": correct_count,
            "incorrectCount": incorrect_count,
            "missedCount": missed_count,
            "accuracy": accuracy_pct,
            "responseTime": round(response_time_seconds, 2),
            "attempts": attempts,
            "hintsUsed": hints_used,
            "performanceScore": final_score,
            "nextDifficultyLevel": next_level,
            "adaptiveAction": action,
            "feedbackMessage": feedback,
            "scoreBreakdown": score_breakdown
        }

    @staticmethod
    def extract_ml_training_features(session_record: Dict[str, Any]) -> Dict[str, Any]:
        """
        Prepares a standardized tabular feature vector for future Machine Learning training
        (e.g., training a Random Forest regressor or classifier on cognitive trajectories).
        """
        return {
            "difficulty_level": session_record.get("difficultyLevel", 1),
            "targets_count": len(session_record.get("objectsShown", [])),
            "accuracy": session_record.get("accuracy", 0.0),
            "response_time_sec": session_record.get("responseTime", 0.0),
            "incorrect_count": len(session_record.get("incorrectAnswers", [])),
            "attempts": session_record.get("attempts", 1),
            "hints_used": session_record.get("hintsUsed", 0),
            "performance_score": session_record.get("performanceScore", 0.0),
            "target_next_level": session_record.get("nextDifficultyLevel", 1)
        }
