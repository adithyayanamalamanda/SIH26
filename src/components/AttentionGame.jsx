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
  const [finished, setFinished] = useState(false)
  const correct = round === 0 ? chosen === 'Apple' : chosen === 'Bell'

  const choose = (label) => {
    setChosen(label)
    if (round === rounds.length - 1) {
      const answersCorrect = (label === 'Bell' ? 1 : 0) + (round === 0 && label === 'Apple' ? 1 : 0)
      const performance = calculatePerformance({ correct: answersCorrect, total: rounds.length, responseTime: 8 })
      const adaptation = recommendDifficulty({ score: performance.score })
      saveGameSession({ patientId: 'P001', gameType: 'attention', difficultyLevel: 1, correctAnswers: answersCorrect, incorrectAnswers: rounds.length - answersCorrect, accuracy: performance.accuracy, responseTime: 8, performanceScore: performance.score, nextDifficultyLevel: adaptation.recommendedLevel, timestamp: new Date().toISOString(), syncStatus: 'saved-locally' })
      setFinished(true)
    }
  }

  if (finished) return <section className="game-panel"><p className="eyebrow">Attention Training</p><h2>{correct ? 'Well noticed!' : 'Good effort!'}</h2><p className="game-instruction">Your attention practice has been saved. Try another activity whenever you are ready.</p><button className="game-primary" onClick={() => { setRound(0); setChosen(null); setFinished(false) }}>Try again <span>→</span></button></section>

  const current = rounds[round]
  return <section className="game-panel"><p className="eyebrow">Attention Training · Round {round + 1} of {rounds.length}</p><h2>{current.prompt}</h2><p className="game-instruction">Look carefully, then tap your answer.</p><div className="attention-options">{current.items.map((item, index) => <button className={`attention-option ${item.color}`} key={`${item.label}-${index}`} onClick={() => round === 0 ? choose(item.label) : choose(item.label)}><span>{item.symbol}</span><strong>{item.label}</strong></button>)}</div>{chosen && round < rounds.length - 1 && <button className="game-primary" onClick={() => { setRound(1); setChosen(null) }}>Next round <span>→</span></button>}</section>
}

export default AttentionGame
