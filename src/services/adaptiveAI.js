// Adaptive AI Cognitive Difficulty Engine
// Performance-based rule evaluation simulating personalized cognitive load adjustment

import { getAIState, saveAIState, getGameHistory } from './storage';

export const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard'];

/**
 * Evaluates game performance and determines next level and rationale
 * @param {string} gameType - 'memory' | 'attention'
 * @param {number} score - Percentage score 0-100
 * @param {string} currentLevel - 'Easy' | 'Medium' | 'Hard'
 * @param {number} avgResponseTime - in seconds
 */
export const calculateAdaptiveDifficulty = (gameType, score, currentLevel, avgResponseTime = 3.0) => {
  const currentIndex = DIFFICULTY_LEVELS.indexOf(currentLevel);
  let nextIndex = currentIndex;
  let action = 'maintained';
  let reason = '';

  if (score >= 80) {
    if (currentIndex < DIFFICULTY_LEVELS.length - 1) {
      nextIndex = currentIndex + 1;
      action = 'increased';
      reason = `Outstanding recall (${score}%) with prompt response (${avgResponseTime.toFixed(1)}s). AI increased challenge to stimulate neuroplasticity.`;
    } else {
      action = 'maintained';
      reason = `Exemplary performance (${score}%) at peak challenge level! AI maintained current mastery tier.`;
    }
  } else if (score >= 50) {
    action = 'maintained';
    reason = `Steady performance (${score}%). AI maintained current level for comfortable cognitive reinforcement.`;
  } else {
    if (currentIndex > 0) {
      nextIndex = currentIndex - 1;
      action = 'decreased';
      reason = `Score was ${score}%. AI gently reduced task complexity to prevent cognitive fatigue and frustration.`;
    } else {
      action = 'maintained';
      reason = `Score was ${score}%. AI maintained relaxed practice pace with supportive hints.`;
    }
  }

  const nextLevel = DIFFICULTY_LEVELS[nextIndex];

  const adjustment = {
    game: gameType === 'memory' ? 'Memory Training' : 'Attention Training',
    previousLevel: currentLevel,
    newLevel: nextLevel,
    score,
    action,
    reason,
    timestamp: new Date().toISOString()
  };

  // Update persisted AI state
  const aiState = getAIState();
  if (gameType === 'memory') {
    aiState.memoryDifficulty = nextLevel;
  } else {
    aiState.attentionDifficulty = nextLevel;
  }
  aiState.lastAdjustment = adjustment;
  saveAIState(aiState);

  return adjustment;
};

/**
 * Checks for multi-session drop to generate smart caregiver alert
 * Non-diagnostic, strictly supportive monitoring
 */
export const checkCaregiverAlertConditions = () => {
  const aiState = getAIState();
  if (aiState.simulatedDrop) {
    return {
      triggered: true,
      severity: 'moderate',
      message: '⚠️ Attention: Patient performance has decreased compared with previous sessions.',
      recommendation: 'Recommend checking if patient is fatigued, needs hydration, or requires rest.',
      isSimulated: true
    };
  }

  const history = getGameHistory();
  if (history.length < 3) {
    return {
      triggered: false,
      message: 'Baseline establishing. Insufficient sessions for alert evaluation.'
    };
  }

  const recentThree = history.slice(0, 3);
  const avgRecent = recentThree.reduce((sum, s) => sum + s.score, 0) / 3;

  // If 3 consecutive scores average below 55%
  if (avgRecent < 55) {
    return {
      triggered: true,
      severity: 'moderate',
      message: '⚠️ Attention: Patient performance has decreased compared with previous sessions.',
      recommendation: 'Recent session scores averaged below baseline. Gentle engagement and checking daily rest is recommended.',
      avgScore: Math.round(avgRecent)
    };
  }

  return {
    triggered: false,
    message: 'Patient performance is stable and within expected baseline limits.'
  };
};
