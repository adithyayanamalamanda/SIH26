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
  const effectiveCorrect = Math.max(0, correct - incorrect)
  const accuracy = total > 0 ? effectiveCorrect / total : 0
  const safeResponseTime = Number.isFinite(responseTime) ? Math.max(0, responseTime) : timeLimit
  const speed = Math.max(0, Math.min(1, 1 - safeResponseTime / timeLimit))
  const completion = completed ? 1 : 0
  const score = Math.round((accuracy * SCORE_WEIGHTS.accuracy + speed * SCORE_WEIGHTS.speed + completion * SCORE_WEIGHTS.completion) * 100)
  return { accuracy: Math.round(accuracy * 100), score: Math.max(0, Math.min(100, score)) }
}
