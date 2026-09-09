import { useState } from 'react'
import { readGameSessions, readReminders, saveReminders } from '../lib/storage'

const starterReminders = [
  { id: 1, type: 'Medicine', text: 'Take medicine', time: '1:00 PM', done: false },
  { id: 2, type: 'Hydration', text: 'Drink some water', time: '2:00 PM', done: false },
  { id: 3, type: 'Activity', text: 'Take a short walk', time: '4:30 PM', done: true },
]

export function RemindersView() {
  const [reminders, setReminders] = useState(() => readReminders(starterReminders))
  const [draft, setDraft] = useState({ type: 'Activity', text: '', time: '' })
  const [saveError, setSaveError] = useState(false)
  const persist = (nextReminders) => {
    setSaveError(!saveReminders(nextReminders))
    setReminders(nextReminders)
  }
  const toggle = (id) => persist(reminders.map((item) => item.id === id ? { ...item, done: !item.done } : item))
  const remove = (id) => persist(reminders.filter((item) => item.id !== id))
  const add = (event) => {
    event.preventDefault()
    if (!draft.text.trim() || !draft.time) return
    persist([...reminders, { ...draft, id: Date.now(), done: false }])
    setDraft({ type: 'Activity', text: '', time: '' })
  }
  return <section className="panel-view"><p className="eyebrow">Daily support</p><h2>Today&apos;s reminder list</h2><p className="panel-intro">A few gentle prompts to help your day feel steady. These are saved locally; they do not send notifications.</p><div className="reminder-list">{reminders.map((item) => <div className={`reminder-row ${item.done ? 'done' : ''}`} key={item.id}><button className="reminder-toggle" onClick={() => toggle(item.id)} aria-label={`${item.done ? 'Mark incomplete' : 'Mark complete'}: ${item.text}`}><span className="reminder-check">{item.done ? '✓' : '○'}</span></button><span><small>{item.type}</small><strong>{item.text}</strong></span><time>{item.time}</time><button className="remove-reminder" onClick={() => remove(item.id)} aria-label={`Remove ${item.text}`}>×</button></div>)}</div><form className="reminder-form" onSubmit={add}><select value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value })} aria-label="Reminder type"><option>Medicine</option><option>Hydration</option><option>Activity</option><option>Appointment</option></select><input value={draft.text} onChange={(event) => setDraft({ ...draft, text: event.target.value })} placeholder="Reminder" aria-label="Reminder text" /><input type="time" value={draft.time} onChange={(event) => setDraft({ ...draft, time: event.target.value })} aria-label="Reminder time" /><button className="secondary-action" type="submit">Add reminder</button></form><p className={`local-note ${saveError ? 'save-error' : ''}`}>{saveError ? 'This reminder could not be saved on this browser.' : 'Reminder list saved on this device.'}</p></section>
}

function MetricSummary({ sessions }) {
  const latest = sessions.at(-1)
  return <div className="progress-summary"><div><small>Latest performance</small><strong>{latest?.performanceScore ?? 0}<span>/100</span></strong></div><div><small>Latest accuracy</small><strong>{latest?.accuracy ?? 0}<span>%</span></strong></div><div><small>Games completed</small><strong>{sessions.length}</strong></div></div>
}

function TrendBars({ values }) {
  return <div className="bars">{values.map((value, index) => <div className="bar-column" key={`${value}-${index}`}><span style={{ height: `${Math.max(4, value)}%` }} /><small>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</small></div>)}</div>
}

export function ProgressView() {
  const sessions = readGameSessions()
  const values = sessions.slice(-7).map((session) => session.performanceScore)
  return <section className="panel-view"><p className="eyebrow">Your practice</p><h2>My progress</h2><p className="panel-intro">These numbers describe your game practice, not a medical condition.</p><MetricSummary sessions={sessions} /><div className="trend-card"><div className="trend-heading"><strong>Recent game scores</strong><span>{sessions.length ? 'Saved sessions' : 'No sessions yet'}</span></div>{values.length ? <TrendBars values={values} /> : <p className="empty-state">Complete a game to see your progress here.</p>}</div></section>
}

export function CaregiverProgress() {
  const sessions = readGameSessions()
  const values = sessions.slice(-7).map((session) => session.performanceScore)
  const declining = values.length >= 3 && values.at(-1) < values.at(-2) && values.at(-2) < values.at(-3)
  return <section className="panel-view"><p className="eyebrow">Caregiver view · Demo data</p><h2>Ramesh&apos;s progress</h2><p className="panel-intro">A clear view of recent cognitive game activity. These indicators are not a diagnosis.</p><MetricSummary sessions={sessions} />{declining && <div className="alert-box"><span>!</span><div><strong>Supportive reminder</strong><p>Recent game performance has declined. Consider checking in with Ramesh.</p></div></div>}<div className="trend-card"><div className="trend-heading"><strong>Recent performance</strong><span>{declining ? 'Needs attention' : 'No concerning trend'}</span></div>{values.length ? <TrendBars values={values} /> : <p className="empty-state">No game sessions have been recorded yet.</p>}</div></section>
}

export function VoiceView({ onStartGame, onShowProgress, language = 'English' }) {
  const [message, setMessage] = useState('Press the microphone and say what you need.')
  const voiceLanguage = { English: 'en-IN', Hindi: 'hi-IN', Telugu: 'te-IN', Assamese: 'as-IN' }[language] || 'en-IN'
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = voiceLanguage
      window.speechSynthesis.speak(utterance)
    }
  }
  const listen = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) { setMessage('Voice recognition is not available here. Please use the buttons in the app.'); return }
    const recognition = new SpeechRecognition()
    recognition.lang = voiceLanguage
    recognition.onresult = ({ results }) => {
      const text = results[0][0].transcript.toLowerCase()
      if (text.includes('game')) { setMessage('Starting your memory game.'); speak('Starting your memory game.'); onStartGame() }
      else if (text.includes('progress')) { setMessage('Opening your progress.'); speak('Opening your progress.'); onShowProgress() }
      else { const response = 'I did not understand. Try saying start memory game or show my progress.'; setMessage(response); speak(response) }
    }
    recognition.onerror = () => setMessage('I could not hear that. Please try again or use a button.')
    recognition.start()
    setMessage('Listening...')
  }
  return <section className="panel-view voice-view"><p className="eyebrow">Talk to MindCare</p><h2>How can I help today?</h2><button className="mic-button" onClick={listen} aria-label="Start voice recognition">⌕</button><p className="voice-message">{message}</p><div className="voice-actions"><button className="secondary-action" onClick={onStartGame}>Start memory game</button><button className="secondary-action" onClick={onShowProgress}>Show my progress</button></div></section>
}
