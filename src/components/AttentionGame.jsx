import { useState } from 'react'
import { calculatePerformance, recommendDifficulty } from '../lib/adaptive'
import { saveGameSession } from '../lib/storage'

const rounds = [
  { prompt: 'Tap the red object', items: [{ label: 'Apple', symbol: '●', color: 'red' }, { label: 'Leaf', symbol: '●', color: 'green' }, { label: 'Sun', symbol: '●', color: 'yellow' }] },
  { prompt: 'Which object appeared twice?', items: [{ label: 'Bell', symbol: '◆', color: 'coral' }, { label: 'Bell', symbol: '◆', color: 'coral' }, { label: 'Star', symbol: '★', color: 'yellow' }] },
]

function AttentionGame() {
  const [round, setRound] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [answers, setAnswers] = useState([])
  const [finished, setFinished] = useState(false)
  const correctAnswers = answers.filter((answer, index) => answer === (index === 0 ? 'Apple' : 'Bell')).length

  const choose = (label) => {
    setChosen(label)
    const nextAnswers = [...answers, label]
    setAnswers(nextAnswers)
    if (round === rounds.length - 1) {
      const answersCorrect = nextAnswers.filter((answer, index) => answer === (index === 0 ? 'Apple' : 'Bell')).length
      const performance = calculatePerformance({ correct: answersCorrect, total: rounds.length, responseTime: 8 })
      const adaptation = recommendDifficulty({ score: performance.score })
      saveGameSession({ patientId: 'P001', gameType: 'attention', difficultyLevel: 1, correctAnswers: answersCorrect, incorrectAnswers: rounds.length - answersCorrect, accuracy: performance.accuracy, responseTime: 8, performanceScore: performance.score, nextDifficultyLevel: adaptation.recommendedLevel, timestamp: new Date().toISOString(), syncStatus: 'saved-locally' })
      setFinished(true)
    }
  }

  if (finished) return <section className="game-panel"><p className="eyebrow">Attention Training</p><h2>{correctAnswers === rounds.length ? 'Well noticed!' : 'Good effort!'}</h2><p className="game-instruction">You answered {correctAnswers} of {rounds.length} correctly. Your attention practice has been saved.</p><button className="game-primary" onClick={() => { setRound(0); setChosen(null); setAnswers([]); setFinished(false) }}>Try again <span>→</span></button></section>

  const current = rounds[round]
  return <section className="game-panel"><p className="eyebrow">Attention Training · Round {round + 1} of {rounds.length}</p><h2>{current.prompt}</h2><p className="game-instruction">Look carefully, then tap your answer.</p><div className="attention-options">{current.items.map((item, index) => <button className={`attention-option ${item.color}`} key={`${item.label}-${index}`} onClick={() => choose(item.label)}><span>{item.symbol}</span><strong>{item.label}</strong></button>)}</div>{chosen && round < rounds.length - 1 && <button className="game-primary" onClick={() => { setRound(1); setChosen(null) }}>Next round <span>→</span></button>}</section>
}

export default AttentionGame
