const SCORE_WEIGHTS = {
  accuracy: 0.7,
  speed: 0.1,
  completion: 0.2,
}

export function recommendDifficulty({ score, currentLevel = 1, maxLevel = 4 }) {
  let recommendedLevel = currentLevel
  let reason = 'Your next challenge will stay at the same level.'

  if (score >= 80) {
    recommendedLevel = Math.min(maxLevel, currentLevel + 1)
    reason = recommendedLevel > currentLevel ? 'Strong recall. Your next challenge will be a little harder.' : 'Strong recall. You are at the highest challenge level.'
  } else if (score < 50) {
    recommendedLevel = Math.max(1, currentLevel - 1)
    reason = recommendedLevel < currentLevel ? 'We will make the next challenge a little gentler.' : 'We will keep the challenge gentle and give you another chance.'
  }

  return { recommendedLevel, reason }
}

export function calculatePerformance({ correct = 0, incorrect = 0, total = 0, responseTime = 30, timeLimit = 30, completed = true }) {
  const safeTotal = Number.isFinite(total) && total > 0 ? total : 0
  const safeCorrect = Number.isFinite(correct) ? Math.max(0, Math.min(correct, safeTotal)) : 0
  const safeResponseTime = Number.isFinite(responseTime) ? Math.max(0, responseTime) : timeLimit
  const safeTimeLimit = Number.isFinite(timeLimit) && timeLimit > 0 ? timeLimit : 30
  const accuracy = safeTotal > 0 ? safeCorrect / safeTotal : 0
  const speed = Math.max(0, Math.min(1, 1 - safeResponseTime / safeTimeLimit))
  const completion = completed ? 1 : 0
  const score = Math.round((accuracy * SCORE_WEIGHTS.accuracy + speed * SCORE_WEIGHTS.speed + completion * SCORE_WEIGHTS.completion + Number.EPSILON) * 100)
  return {
    accuracy: Math.round(accuracy * 100),
    incorrect: Number.isFinite(incorrect) ? Math.max(0, incorrect) : 0,
    score: Math.max(0, Math.min(100, score)),
  }
}
