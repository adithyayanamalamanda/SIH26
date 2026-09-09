import assert from 'node:assert/strict'
import test from 'node:test'
import { calculatePerformance, recommendDifficulty } from '../src/lib/adaptive.js'
import { parseVoiceCommand } from '../src/lib/voiceCommands.js'

test('performance accuracy reflects correct answers without double-penalizing mistakes', () => {
  const result = calculatePerformance({ correct: 3, incorrect: 1, total: 4, responseTime: 15 })

  assert.equal(result.accuracy, 75)
  assert.equal(result.score, 78)
})

test('difficulty recommendations respect level boundaries', () => {
  assert.equal(recommendDifficulty({ score: 90, currentLevel: 4 }).recommendedLevel, 4)
  assert.equal(recommendDifficulty({ score: 20, currentLevel: 1 }).recommendedLevel, 1)
  assert.equal(recommendDifficulty({ score: 60, currentLevel: 2 }).recommendedLevel, 2)
})

test('voice commands map natural navigation phrases to app views', () => {
  assert.equal(parseVoiceCommand('open my progress'), 'progress')
  assert.equal(parseVoiceCommand('start the attention game'), 'attention')
  assert.equal(parseVoiceCommand('go back'), 'back')
  assert.equal(parseVoiceCommand('something else'), null)
})
