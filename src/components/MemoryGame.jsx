import { useEffect, useState } from 'react'
import { calculatePerformance, recommendDifficulty } from '../lib/adaptive'
import { readCurrentDifficulty, saveGameSession } from '../lib/storage'

const memoryObjects = [
  { id: 'apple', label: 'Apple', symbol: '🍎' },
  { id: 'house', label: 'House', symbol: '🏠' },
  { id: 'flower', label: 'Flower', symbol: '🌼' },
  { id: 'car', label: 'Car', symbol: '🚗' },
  { id: 'key', label: 'Key', symbol: '🔑' },
  { id: 'clock', label: 'Clock', symbol: '🕰️' },
]

const distractors = [
  { id: 'book', label: 'Book', symbol: '📖' },
  { id: 'ball', label: 'Ball', symbol: '⚽' },
  { id: 'cat', label: 'Cat', symbol: '🐈' },
  { id: 'cup', label: 'Cup', symbol: '☕' },
  { id: 'umbrella', label: 'Umbrella', symbol: '☂️' },
  { id: 'chair', label: 'Chair', symbol: '🪑' },
]

const levelSettings = {
  1: { targetCount: 3, displayMs: 6500 },
  2: { targetCount: 4, displayMs: 5000 },
  3: { targetCount: 5, displayMs: 4000 },
  4: { targetCount: 6, displayMs: 3500 },
}

function shuffle(items) {
  const shuffled = [...items]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const replacement = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[replacement]] = [shuffled[replacement], shuffled[index]]
  }
  return shuffled
}

function createRound(level) {
  const settings = levelSettings[level]
  const targets = shuffle(memoryObjects).slice(0, settings.targetCount)
  const otherChoices = shuffle(distractors).slice(0, settings.targetCount)
  return { choices: shuffle([...targets, ...otherChoices]), settings, targets }
}

function MemoryGame() {
  const [currentLevel, setCurrentLevel] = useState(() => readCurrentDifficulty('memory_recall'))
  const [round, setRound] = useState(() => createRound(readCurrentDifficulty('memory_recall')))
  const [stage, setStage] = useState('intro')
  const [selected, setSelected] = useState([])
  const [startedAt, setStartedAt] = useState(null)
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (stage !== 'show') return undefined
    const timer = window.setTimeout(() => {
      setStage('quiz')
      setStartedAt(Date.now())
    }, round.settings.displayMs)
    return () => window.clearTimeout(timer)
  }, [round.settings.displayMs, stage])

  const startGame = () => {
    setRound(createRound(currentLevel))
    setSelected([])
    setResult(null)
    setStage('show')
  }

  const toggleChoice = (id) => {
    setSelected((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id)
      if (current.length >= round.targets.length) return current
      return [...current, id]
    })
  }

  const submitGame = () => {
    const correct = selected.filter((id) => round.targets.some((item) => item.id === id)).length
    const incorrect = selected.length - correct
    const responseTime = startedAt ? Math.max(1, Math.round((Date.now() - startedAt) / 1000)) : 30
    const performance = calculatePerformance({ correct, incorrect, total: round.targets.length, responseTime })
    const adaptation = recommendDifficulty({ currentLevel, score: performance.score })
    const saved = saveGameSession({
      patientId: 'P001',
      gameType: 'memory_recall',
      difficultyLevel: currentLevel,
      correctAnswers: correct,
      incorrectAnswers: incorrect,
      accuracy: performance.accuracy,
      responseTime,
      performanceScore: performance.score,
      nextDifficultyLevel: adaptation.recommendedLevel,
      timestamp: new Date().toISOString(),
      syncStatus: 'local-only',
    })

    setCurrentLevel(adaptation.recommendedLevel)
    setResult({
      ...performance,
      correct,
      incorrect,
      nextLevel: adaptation.recommendedLevel,
      reason: adaptation.reason,
      saved,
      responseTime,
    })
    setStage('result')
  }

  return (
    <section className="game-panel" aria-live="polite">
      {stage === 'intro' && <>
        <p className="eyebrow">Memory Training · Level {currentLevel}</p>
        <h2>Remember familiar objects</h2>
        <p className="game-instruction">You will see a few objects for a short time. Then choose only the objects you saw.</p>
        <button className="game-primary" onClick={startGame}>Start memory game <span>→</span></button>
      </>}

      {stage === 'show' && <>
        <p className="eyebrow">Memory Training · Level {currentLevel}</p>
        <h2>Look carefully</h2>
        <div className="object-row">{round.targets.map((item) => <div className="memory-object" key={item.id}><span>{item.symbol}</span><strong>{item.label}</strong></div>)}</div>
        <p className="countdown-note">The question will appear shortly.</p>
      </>}

      {stage === 'quiz' && <>
        <p className="eyebrow">Memory Training · Choose all that you saw</p>
        <h2>Which objects did you see?</h2>
        <p className="game-instruction">Choose up to {round.targets.length} objects. Take your time.</p>
        <div className="choice-grid">
          {round.choices.map((item) => {
            const isSelected = selected.includes(item.id)
            const isDisabled = !isSelected && selected.length >= round.targets.length
            return <button aria-pressed={isSelected} className={`choice-button ${isSelected ? 'selected' : ''}`} disabled={isDisabled} key={item.id} onClick={() => toggleChoice(item.id)}><span>{item.symbol}</span><strong>{item.label}</strong>{isSelected && <b aria-label="Selected">✓</b>}</button>
          })}
        </div>
        <button className="game-primary" disabled={selected.length === 0} onClick={submitGame}>Check my answers <span>→</span></button>
      </>}

      {stage === 'result' && result && <>
        <p className="eyebrow">Your result · Level {currentLevel}</p>
        <h2>{result.score >= 80 ? 'Great job!' : 'Good effort!'}</h2>
        <p className="game-instruction">You remembered {result.correct} of {round.targets.length} objects. Every practice session helps.</p>
        <div className="result-grid"><div><strong>{result.accuracy}%</strong><span>Accuracy</span></div><div><strong>{result.responseTime}s</strong><span>Response time</span></div><div><strong>{result.score}</strong><span>Performance score</span></div></div>
        <div className="adaptation-note"><span>✦</span><p>{result.reason} Next level: {result.nextLevel}.</p></div>
        <p className={`save-note ${result.saved ? '' : 'save-error'}`}>{result.saved ? 'Saved in this browser.' : 'Your result could not be saved on this browser.'}</p>
        <button className="game-primary" onClick={startGame}>Try again <span>→</span></button>
      </>}
    </section>
  )
}

export default MemoryGame
