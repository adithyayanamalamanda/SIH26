import { useEffect, useRef, useState } from 'react'
import AttentionGame from './components/AttentionGame'
import MemoryGame from './components/MemoryGame'
import { CaregiverProgress, ProgressView, RemindersView, VoiceView } from './components/PrototypePanels'
import { readGameSessions, saveSyncStatus, subscribeToStorageChanges } from './lib/storage'
import { parseVoiceCommand, voiceCommandHelp } from './lib/voiceCommands'
import './App.css'

const dateLocales = {
  English: 'en-IN',
  Hindi: 'hi-IN',
  Telugu: 'te-IN',
  Assamese: 'as-IN',
}

const elderlyNavItems = [
  { icon: '⌂', label: 'Home', view: 'home' },
  { icon: '◈', label: 'Games', view: 'games' },
  { icon: '◷', label: 'Reminders', view: 'reminders' },
  { icon: '▦', label: 'Progress', view: 'progress' },
  { icon: '◌', label: 'Voice Assistant', view: 'voice assistant' },
]

const caregiverNavItems = [
  { icon: '⌂', label: 'Dashboard', view: 'dashboard' },
  { icon: '▦', label: 'Patient Progress', view: 'patient progress' },
  { icon: '!', label: 'Alerts', view: 'alerts' },
  { icon: '◷', label: 'Reminders', view: 'reminders' },
]

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function CaregiverDashboard() {
  const sessions = readGameSessions()
  const today = new Date().toDateString()
  const todaySessions = sessions.filter((session) => new Date(session.timestamp).toDateString() === today)
  const latest = sessions.at(-1)

  return <div className="dashboard-grid"><article className="info-card large-card"><p className="card-label">Demo patient overview</p><h3>Ramesh Kumar</h3><p>{latest ? `Last game played ${new Date(latest.timestamp).toLocaleDateString('en-IN')}` : 'No game sessions have been recorded yet.'}</p></article><article className="info-card"><p className="card-label">Today&apos;s game activity</p><strong className="metric">{todaySessions.length}</strong><p>{todaySessions.length === 1 ? 'game recorded today' : 'games recorded today'}</p></article><article className="info-card"><p className="card-label">Latest game performance</p><strong className="metric">{latest?.performanceScore ?? '—'}{latest && <span>/100</span>}</strong><p className={latest ? 'positive-copy' : ''}>{latest ? `${latest.gameType === 'attention' ? 'Attention' : 'Memory'} training` : 'Complete a game to see a score'}</p></article></div>
}

function VoiceNavigator({ language, isCaregiver, onCommand }) {
  const [status, setStatus] = useState('Voice navigation ready')
  const voiceLanguage = dateLocales[language] || dateLocales.English
  const speak = (text) => {
    if (!('speechSynthesis' in window)) return
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = voiceLanguage
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }
  const listen = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      const message = 'Voice commands are not supported in this browser.'
      setStatus(message)
      speak(message)
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = voiceLanguage
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onstart = () => setStatus('Listening for a command...')
    recognition.onresult = ({ results }) => {
      const transcript = results[0][0].transcript
      const action = parseVoiceCommand(transcript)
      if (!action) {
        const message = `I heard “${transcript}”. ${voiceCommandHelp(isCaregiver)}`
        setStatus(message)
        speak(message)
        return
      }
      onCommand(action)
      const message = action === 'back' ? 'Going back.' : `Opening ${action}.`
      setStatus(`Heard: ${transcript}`)
      speak(message)
    }
    recognition.onerror = () => {
      const message = 'I could not hear that. Press the microphone and try again.'
      setStatus(message)
      speak(message)
    }
    recognition.onend = () => setStatus((current) => current === 'Listening for a command...' ? 'Voice navigation ready' : current)
    recognition.start()
  }
  return <div className="voice-control"><button className="voice-control-button" onClick={listen} aria-label="Listen for a voice command" title="Voice command">⌕</button><span aria-live="polite">{status}</span></div>
}

function App() {
  const [mode, setMode] = useState('welcome')
  const [activeView, setActiveView] = useState('home')
  const [dateLanguage, setDateLanguage] = useState('English')
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [connectionMessage, setConnectionMessage] = useState('')
  const [storageRevision, setStorageRevision] = useState(0)
  const contentRef = useRef(null)
  const isCaregiver = mode === 'caregiver'

  useEffect(() => {
    let messageTimer
    const updateStatus = () => {
      const online = navigator.onLine
      setIsOnline(online)
      saveSyncStatus(online ? 'online-local-only' : 'offline-local-only')
      setConnectionMessage(online ? 'You are online. Data remains saved only in this browser.' : 'You are offline. Data remains saved only in this browser.')
      window.clearTimeout(messageTimer)
      messageTimer = window.setTimeout(() => setConnectionMessage(''), 5000)
    }
    window.addEventListener('online', updateStatus)
    window.addEventListener('offline', updateStatus)
    return () => {
      window.clearTimeout(messageTimer)
      window.removeEventListener('online', updateStatus)
      window.removeEventListener('offline', updateStatus)
    }
  }, [])

  useEffect(() => subscribeToStorageChanges(() => setStorageRevision((revision) => revision + 1)), [])

  useEffect(() => {
    document.documentElement.lang = dateLocales[dateLanguage]
  }, [dateLanguage])

  useEffect(() => {
    if (mode !== 'welcome') contentRef.current?.focus()
  }, [activeView, mode])

  const enterMode = (nextMode) => {
    setMode(nextMode)
    setActiveView(nextMode === 'caregiver' ? 'dashboard' : 'home')
  }

  const handleVoiceCommand = (action) => {
    if (action === 'elderly' || action === 'caregiver') {
      enterMode(action)
      return
    }
    if (mode === 'welcome') {
      setMode('elderly')
      setActiveView(action === 'dashboard' ? 'home' : action)
      return
    }
    if (action === 'back') {
      setActiveView(isCaregiver ? 'dashboard' : 'home')
      return
    }
    const caregiverOnly = ['dashboard', 'patient progress', 'alerts']
    if (caregiverOnly.includes(action) && !isCaregiver) {
      enterMode('caregiver')
      setActiveView(action)
      return
    }
    if (action === 'dashboard' && isCaregiver) setActiveView('dashboard')
    else setActiveView(action)
  }

  if (mode === 'welcome') {
    return (
      <main className="welcome-shell">
        <section className="welcome-panel" aria-labelledby="welcome-title">
          <div className="brand-mark" aria-hidden="true">MC</div>
          <p className="eyebrow">A calmer way to keep the mind active</p>
          <h1 id="welcome-title">MindCare</h1>
          <p className="welcome-copy">Gentle memory exercises and daily support, designed for older adults and the people who care for them.</p>
          <div className="entry-actions">
            <button className="entry-button primary" onClick={() => enterMode('elderly')}><span className="button-symbol" aria-hidden="true">+</span><span><strong>Elderly User</strong><small>Start today&apos;s activities</small></span></button>
            <button className="entry-button secondary" onClick={() => enterMode('caregiver')}><span className="button-symbol" aria-hidden="true">↗</span><span><strong>Caregiver</strong><small>View demo progress and support</small></span></button>
          </div>
          <VoiceNavigator language={dateLanguage} isCaregiver={false} onCommand={handleVoiceCommand} />
          <p className="safety-note">For cognitive engagement only. MindCare is not a medical diagnosis tool.</p>
        </section>
        <aside className="welcome-aside" aria-label="MindCare highlights"><div className="aside-stamp">TODAY</div><div className="aside-illustration" aria-hidden="true"><span className="illustration-sun">✦</span><span className="illustration-leaf leaf-one">⌁</span><span className="illustration-leaf leaf-two">⌁</span></div><p className="aside-kicker">Small steps count</p><h2>A little practice can make today feel brighter.</h2><div className="aside-rule" /><p>Simple activities, clear instructions, and a pace that responds to you.</p></aside>
      </main>
    )
  }

  const navItems = isCaregiver ? caregiverNavItems : elderlyNavItems
  const backLabel = isCaregiver ? 'Back to Dashboard' : 'Back to Home'
  const isSubView = activeView !== (isCaregiver ? 'dashboard' : 'home')
  const date = new Intl.DateTimeFormat(dateLocales[dateLanguage], { dateStyle: 'full' }).format(new Date())

  void storageRevision
  let view
  if (activeView === 'games') view = <MemoryGame />
  else if (activeView === 'attention') view = <AttentionGame />
  else if (activeView === 'reminders') view = <RemindersView />
  else if (activeView === 'progress') view = <ProgressView />
  else if (activeView === 'voice assistant') view = <VoiceView language={dateLanguage} onStartGame={() => setActiveView('games')} onShowProgress={() => setActiveView('progress')} />
  else if (isCaregiver && activeView === 'patient progress') view = <CaregiverProgress />
  else if (isCaregiver && activeView === 'alerts') view = <CaregiverProgress alertsOnly />
  else if (isCaregiver) view = <CaregiverDashboard />
  else view = <><div className="action-grid"><button className="feature-card memory-card" onClick={() => setActiveView('games')}><span className="feature-icon" aria-hidden="true">✦</span><span><small>About 5 minutes</small><strong>Memory Training</strong><em>Remember familiar objects</em></span><b>→</b></button><button className="feature-card attention-card" onClick={() => setActiveView('attention')}><span className="feature-icon" aria-hidden="true">●</span><span><small>About 3 minutes</small><strong>Attention Training</strong><em>Notice what changes</em></span><b>→</b></button></div><div className="lower-grid"><article className="info-card"><p className="card-label">Reminder list</p><h3>One thing at a time</h3><p>Keep your daily plans together in one place.</p><button className="text-action" onClick={() => setActiveView('reminders')}>View reminder list <span>→</span></button></article><article className="info-card progress-card"><p className="card-label">My progress</p><strong className="metric">Local<span> history</span></strong><p>Review saved game sessions</p><button className="text-action" onClick={() => setActiveView('progress')}>View progress <span>→</span></button></article></div></>

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="wordmark" onClick={() => { setMode('welcome'); setActiveView('home') }}><span className="wordmark-mark">MC</span><span>MindCare</span></button>
        <div className="topbar-meta" aria-live="polite"><span className={`status-dot ${isOnline ? '' : 'offline'}`} /><span>{connectionMessage || (isOnline ? 'Online · saved only in this browser' : 'Offline · saved only in this browser')}</span><VoiceNavigator language={dateLanguage} isCaregiver={isCaregiver} onCommand={handleVoiceCommand} /><select className="language-select" value={dateLanguage} onChange={(event) => setDateLanguage(event.target.value)} aria-label="Choose date format language"><option>English</option><option>Hindi</option><option>Telugu</option><option>Assamese</option></select><button className="switch-link" onClick={() => enterMode(isCaregiver ? 'elderly' : 'caregiver')}>Switch to {isCaregiver ? 'elderly view' : 'caregiver view'}</button></div>
      </header>
      <div className="app-layout">
        <nav className="side-nav" aria-label="Main navigation"><p className="nav-label">{isCaregiver ? 'Care team · demo' : 'My day'}</p>{navItems.map((item) => <button aria-current={activeView === item.view ? 'page' : undefined} className={`nav-item ${activeView === item.view ? 'active' : ''}`} key={item.view} onClick={() => setActiveView(item.view)}><span className="nav-icon" aria-hidden="true">{item.icon}</span>{item.label}</button>)}<div className="nav-footer"><p>Need a little help?</p><button className="help-button" onClick={() => setActiveView('voice assistant')}>Speak with MindCare</button></div></nav>
        <section className="content-area" ref={contentRef} tabIndex="-1"><div className="content-heading"><div><p className="eyebrow">{date}</p><h1>{isCaregiver ? `${greeting()}, caregiver` : `${greeting()}, Ramesh`}</h1></div><div className="profile-chip"><span>RK</span><strong>{isCaregiver ? 'Demo caregiver' : 'Ramesh'}</strong></div></div>{isSubView && <button className="back-button" onClick={() => setActiveView(isCaregiver ? 'dashboard' : 'home')}>← {backLabel}</button>}<div className="hero-banner"><div><p className="banner-kicker">{isCaregiver ? 'Demo overview' : 'A gentle start'}</p><h2>{isCaregiver ? 'Review local game activity with care.' : 'Ready for today&apos;s activities?'}</h2><p>{isCaregiver ? 'Scores describe game performance only and are not medical indicators.' : 'Choose one small activity. You can take your time.'}</p></div><span className="banner-mark" aria-hidden="true">✦</span></div>{view}</section>
      </div>
    </main>
  )
}

export default App
