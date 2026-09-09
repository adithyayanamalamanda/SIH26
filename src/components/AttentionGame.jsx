import { useState } from 'react'
import { calculatePerformance, recommendDifficulty } from '../lib/adaptive'
import { readCurrentDifficulty, saveGameSession } from '../lib/storage'

const roundDefinitions = [
  {
    prompt: 'Tap the red object',
    correctLabel: 'Apple',
    items: [{ label: 'Apple', symbol: '●', color: 'red' }, { label: 'Leaf', symbol: '●', color: 'green' }, { label: 'Sun', symbol: '●', color: 'yellow' }],
  },
  {
    prompt: 'Which object appeared twice?',
    correctLabel: 'Bell',
    items: [{ label: 'Bell', symbol: '◆', color: 'coral' }, { label: 'Bell', symbol: '◆', color: 'coral' }, { label: 'Star', symbol: '★', color: 'yellow' }],
  },
  {
    prompt: 'Tap the star',
    correctLabel: 'Star',
    items: [{ label: 'Circle', symbol: '●', color: 'green' }, { label: 'Star', symbol: '★', color: 'yellow' }, { label: 'Diamond', symbol: '◆', color: 'coral' }],
  },
  {
    prompt: 'Tap the green object',
    correctLabel: 'Leaf',
    items: [{ label: 'Leaf', symbol: '●', color: 'green' }, { label: 'Apple', symbol: '●', color: 'red' }, { label: 'Sun', symbol: '●', color: 'yellow' }],
  },
]

function roundsForLevel(level) {
  return roundDefinitions.slice(0, Math.min(roundDefinitions.length, level + 1))
}

function currentTime() {
  return Date.now()
}

function AttentionGame() {
  const [currentLevel, setCurrentLevel] = useState(() => readCurrentDifficulty('attention'))
  const [round, setRound] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [answers, setAnswers] = useState([])
  const [roundStartedAt, setRoundStartedAt] = useState(() => currentTime())
  const [result, setResult] = useState(null)
  const activeRounds = roundsForLevel(currentLevel)
  const current = activeRounds[round]

  const choose = (label) => {
    if (chosen) return

    const responseTime = Math.max(1, Math.round((currentTime() - roundStartedAt) / 1000))
    const answer = { correct: label === current.correctLabel, responseTime }
    const nextAnswers = [...answers, answer]
    setChosen(label)
    setAnswers(nextAnswers)

    if (round === activeRounds.length - 1) {
      const correctAnswers = nextAnswers.filter((item) => item.correct).length
      const averageResponseTime = Math.round(nextAnswers.reduce((total, item) => total + item.responseTime, 0) / nextAnswers.length)
      const performance = calculatePerformance({ correct: correctAnswers, incorrect: activeRounds.length - correctAnswers, total: activeRounds.length, responseTime: averageResponseTime })
      const adaptation = recommendDifficulty({ currentLevel, score: performance.score })
      const saved = saveGameSession({
        patientId: 'P001',
        gameType: 'attention',
        difficultyLevel: currentLevel,
        correctAnswers,
        incorrectAnswers: activeRounds.length - correctAnswers,
        accuracy: performance.accuracy,
        responseTime: averageResponseTime,
        performanceScore: performance.score,
        nextDifficultyLevel: adaptation.recommendedLevel,
        timestamp: new Date().toISOString(),
        syncStatus: 'local-only',
      })

      setCurrentLevel(adaptation.recommendedLevel)
      setResult({ ...performance, completedLevel: currentLevel, correctAnswers, nextLevel: adaptation.recommendedLevel, saved, totalRounds: activeRounds.length })
    }
  }

  const nextRound = () => {
    setRound((currentRound) => currentRound + 1)
    setChosen(null)
    setRoundStartedAt(currentTime())
  }

  const startAgain = () => {
    setRound(0)
    setChosen(null)
    setAnswers([])
    setRoundStartedAt(currentTime())
    setResult(null)
  }

  if (result) {
    return <section className="game-panel" aria-live="polite"><p className="eyebrow">Attention Training · Level {result.completedLevel}</p><h2>{result.correctAnswers === result.totalRounds ? 'Well noticed!' : 'Good effort!'}</h2><p className="game-instruction">You answered {result.correctAnswers} of {result.totalRounds} correctly. Every practice session helps.</p><div className="result-grid"><div><strong>{result.accuracy}%</strong><span>Accuracy</span></div><div><strong>{result.score}</strong><span>Performance score</span></div><div><strong>{result.nextLevel}</strong><span>Next level</span></div></div><p className={`save-note ${result.saved ? '' : 'save-error'}`}>{result.saved ? 'Saved in this browser.' : 'Your result could not be saved on this browser.'}</p><button className="game-primary" onClick={startAgain}>Try again <span>→</span></button></section>
  }

  return <section className="game-panel" aria-live="polite"><p className="eyebrow">Attention Training · Level {currentLevel} · Round {round + 1} of {activeRounds.length}</p><h2>{current.prompt}</h2><p className="game-instruction">Look carefully, then tap one answer.</p><div className="attention-options">{current.items.map((item, index) => <button aria-pressed={chosen === item.label} className={`attention-option ${item.color}`} disabled={Boolean(chosen)} key={`${item.label}-${index}`} onClick={() => choose(item.label)}><span>{item.symbol}</span><strong>{item.label}</strong></button>)}</div>{chosen && round < activeRounds.length - 1 && <button className="game-primary" onClick={nextRound}>Next round <span>→</span></button>}</section>
}

export default AttentionGame
