import { useEffect, useState } from 'react'
import { readGameSessions } from '../lib/storage'

const starterReminders = [
  { id: 1, type: 'Medicine', text: 'Take medicine', time: '1:00 PM', done: false },
  { id: 2, type: 'Hydration', text: 'Drink some water', time: '2:00 PM', done: false },
  { id: 3, type: 'Activity', text: 'Take a short walk', time: '4:30 PM', done: true },
]

function readReminders() {
  try { return JSON.parse(window.localStorage.getItem('mindcare.reminders') || 'null') || starterReminders } catch { return starterReminders }
}

export function RemindersView() {
  const [reminders, setReminders] = useState(readReminders)
  useEffect(() => window.localStorage.setItem('mindcare.reminders', JSON.stringify(reminders)), [reminders])
  const toggle = (id) => setReminders((items) => items.map((item) => item.id === id ? { ...item, done: !item.done } : item))
  return <section className="panel-view"><p className="eyebrow">Daily support</p><h2>Today&apos;s reminders</h2><p className="panel-intro">A few gentle prompts to help your day feel steady.</p><div className="reminder-list">{reminders.map((item) => <button className={`reminder-row ${item.done ? 'done' : ''}`} key={item.id} onClick={() => toggle(item.id)}><span className="reminder-check">{item.done ? '✓' : '○'}</span><span><small>{item.type}</small><strong>{item.text}</strong></span><time>{item.time}</time></button>)}</div><p className="local-note">Reminders are saved on this device.</p></section>
}

export function ProgressView() {
  const sessions = readGameSessions()
  const latest = sessions.at(-1)
  const score = latest?.performanceScore || 78
  return <section className="panel-view"><p className="eyebrow">Your practice</p><h2>My progress</h2><p className="panel-intro">These numbers describe your game practice, not a medical condition.</p><div className="progress-summary"><div><small>Latest performance</small><strong>{score}<span>/100</span></strong></div><div><small>Games completed</small><strong>{sessions.length || 3}</strong></div><div><small>Current level</small><strong>{latest?.nextDifficultyLevel || 1}</strong></div></div><div className="trend-card"><div className="trend-heading"><strong>Recent game scores</strong><span>Last 7 sessions</span></div><div className="bars">{[62, 68, 64, 73, 78, score].map((value, index) => <div className="bar-column" key={`${value}-${index}`}><span style={{ height: `${value}%` }} /><small>{['M', 'T', 'W', 'T', 'F', 'S'][index]}</small></div>)}</div></div></section>
}

export function CaregiverProgress() {
  const sessions = readGameSessions()
  const latest = sessions.at(-1)
  return <section className="panel-view"><p className="eyebrow">Caregiver view · Demo data</p><h2>Ramesh&apos;s progress</h2><p className="panel-intro">A clear view of recent cognitive game activity. These indicators are not a diagnosis.</p><div className="progress-summary caregiver-summary"><div><small>Performance</small><strong>{latest?.performanceScore || 78}<span>/100</span></strong></div><div><small>Accuracy</small><strong>{latest?.accuracy || 82}<span>%</span></strong></div><div><small>Games</small><strong>{sessions.length || 15}</strong></div></div><div className="alert-box"><span>!</span><div><strong>Supportive reminder</strong><p>Recent activity is available for review. Consider checking in after today&apos;s practice.</p></div></div><div className="trend-card"><div className="trend-heading"><strong>Weekly performance</strong><span>Improving</span></div><div className="bars">{[60, 65, 72, 70, 78, 82, 85].map((value, index) => <div className="bar-column" key={`${value}-${index}`}><span style={{ height: `${value}%` }} /><small>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</small></div>)}</div></div></section>
}

export function VoiceView({ onStartGame, onShowProgress }) {
  const [message, setMessage] = useState('Press the microphone and say what you need.')
  const listen = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) { setMessage('Voice recognition is not available here. Please use the buttons in the app.'); return }
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-IN'
    recognition.onresult = ({ results }) => {
      const text = results[0][0].transcript.toLowerCase()
      if (text.includes('game')) { setMessage('Starting your memory game.'); onStartGame() }
      else if (text.includes('progress')) { setMessage('Opening your progress.'); onShowProgress() }
      else setMessage(`I heard: “${text}”. Try saying “start memory game” or “show my progress”.`)
    }
    recognition.onerror = () => setMessage('I could not hear that. Please try again or use a button.')
    recognition.start()
    setMessage('Listening...')
  }
  return <section className="panel-view voice-view"><p className="eyebrow">Talk to MindCare</p><h2>How can I help today?</h2><button className="mic-button" onClick={listen} aria-label="Start voice recognition">⌕</button><p className="voice-message">{message}</p><div className="voice-actions"><button className="secondary-action" onClick={onStartGame}>Start memory game</button><button className="secondary-action" onClick={onShowProgress}>Show my progress</button></div></section>
}
