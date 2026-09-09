import { useEffect, useState } from 'react'
import { calculatePerformance, recommendDifficulty } from '../lib/adaptive'
import { saveGameSession } from '../lib/storage'

const objects = [
  { id: 'apple', label: 'Apple', symbol: '🍎' },
  { id: 'house', label: 'House', symbol: '🏠' },
  { id: 'flower', label: 'Flower', symbol: '🌼' },
  { id: 'car', label: 'Car', symbol: '🚗' },
]

const distractors = [
  { id: 'book', label: 'Book', symbol: '📖' },
  { id: 'ball', label: 'Ball', symbol: '⚽' },
  { id: 'cat', label: 'Cat', symbol: '🐈' },
  { id: 'cup', label: 'Cup', symbol: '☕' },
]

function MemoryGame() {
  const [stage, setStage] = useState('intro')
  const [selected, setSelected] = useState([])
  const [startedAt, setStartedAt] = useState(null)
  const [result, setResult] = useState(null)

  const choices = [...objects, ...distractors]

  useEffect(() => {
    if (stage !== 'show') return undefined
    const timer = window.setTimeout(() => {
      setStage('quiz')
      setStartedAt(Date.now())
    }, 5000)
    return () => window.clearTimeout(timer)
  }, [stage])

  const startGame = () => {
    setSelected([])
    setResult(null)
    setStage('show')
  }

  const toggleChoice = (id) => {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }

  const submitGame = () => {
    const correct = selected.filter((id) => objects.some((item) => item.id === id)).length
    const incorrect = selected.filter((id) => distractors.some((item) => item.id === id)).length
    const responseTime = Math.max(1, Math.round((Date.now() - startedAt) / 1000))
    const performance = calculatePerformance({ correct, total: objects.length, responseTime })
    const adaptation = recommendDifficulty({ score: performance.score })
    saveGameSession({
      patientId: 'P001', gameType: 'memory_recall', difficultyLevel: 1,
      correctAnswers: correct, incorrectAnswers: incorrect, accuracy: performance.accuracy,
      responseTime, performanceScore: performance.score, nextDifficultyLevel: adaptation.recommendedLevel,
      timestamp: new Date().toISOString(), syncStatus: 'saved-locally',
    })
    setResult({ correct, incorrect, score: performance.score, accuracy: performance.accuracy, responseTime, nextLevel: adaptation.recommendedLevel, reason: adaptation.reason })
    setStage('result')
  }

  return (
    <section className="game-panel" aria-live="polite">
      {stage === 'intro' && <>
        <p className="eyebrow">Memory Training · Level 1</p>
        <h2>Remember familiar objects</h2>
        <p className="game-instruction">You will see four objects for a few seconds. Try to remember them, then choose the ones you saw.</p>
        <button className="game-primary" onClick={startGame}>Start memory game <span>→</span></button>
      </>}
      {stage === 'show' && <>
        <p className="eyebrow">Remember these</p>
        <h2>Look carefully</h2>
        <div className="object-row">{objects.map((item) => <div className="memory-object" key={item.id}><span>{item.symbol}</span><strong>{item.label}</strong></div>)}</div>
        <p className="countdown-note">The next question will appear in a moment.</p>
      </>}
      {stage === 'quiz' && <>
        <p className="eyebrow">Memory Training · Choose all that you saw</p>
        <h2>Which objects did you see?</h2>
        <div className="choice-grid">{choices.map((item) => <button className={`choice-button ${selected.includes(item.id) ? 'selected' : ''}`} key={item.id} onClick={() => toggleChoice(item.id)}><span>{item.symbol}</span><strong>{item.label}</strong>{selected.includes(item.id) && <b aria-label="Selected">✓</b>}</button>)}</div>
        <button className="game-primary" disabled={selected.length === 0} onClick={submitGame}>Check my answers <span>→</span></button>
      </>}
      {stage === 'result' && result && <>
        <p className="eyebrow">Your result</p>
        <h2>{result.score >= 80 ? 'Great job!' : 'Good effort!'}</h2>
        <p className="game-instruction">You remembered {result.correct} of {objects.length} objects. Every practice session helps.</p>
        <div className="result-grid"><div><strong>{result.accuracy}%</strong><span>Accuracy</span></div><div><strong>{result.responseTime}s</strong><span>Response time</span></div><div><strong>{result.score}</strong><span>Performance score</span></div></div>
        <div className="adaptation-note"><span>✦</span><p>{result.reason} Next level: {result.nextLevel}.</p></div>
        <button className="game-primary" onClick={startGame}>Try once more <span>→</span></button>
      </>}
    </section>
  )
}

export default MemoryGame
