import { useEffect, useState } from 'react'
import AttentionGame from './components/AttentionGame'
import MemoryGame from './components/MemoryGame'
import { CaregiverProgress, ProgressView, RemindersView, VoiceView } from './components/PrototypePanels'
import './App.css'

function App() {
  const [mode, setMode] = useState('welcome')
  const [activeView, setActiveView] = useState('home')
  const [language, setLanguage] = useState('English')
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine)
    window.addEventListener('online', updateStatus)
    window.addEventListener('offline', updateStatus)
    return () => {
      window.removeEventListener('online', updateStatus)
      window.removeEventListener('offline', updateStatus)
    }
  }, [])

  if (mode === 'welcome') {
    return (
      <main className="welcome-shell">
        <section className="welcome-panel" aria-labelledby="welcome-title">
          <div className="brand-mark" aria-hidden="true">MC</div>
          <p className="eyebrow">A calmer way to keep the mind active</p>
          <h1 id="welcome-title">MindCare</h1>
          <p className="welcome-copy">Gentle memory exercises and daily support, designed for older adults and the people who care for them.</p>
          <div className="entry-actions">
            <button className="entry-button primary" onClick={() => setMode('elderly')}>
              <span className="button-symbol" aria-hidden="true">+</span>
              <span><strong>Elderly User</strong><small>Start today&apos;s activities</small></span>
            </button>
            <button className="entry-button secondary" onClick={() => setMode('caregiver')}>
              <span className="button-symbol" aria-hidden="true">↗</span>
              <span><strong>Caregiver</strong><small>View progress and support</small></span>
            </button>
          </div>
          <p className="safety-note">For cognitive engagement only. MindCare is not a medical diagnosis tool.</p>
        </section>
        <aside className="welcome-aside" aria-label="MindCare highlights">
          <div className="aside-stamp">TODAY</div>
          <div className="aside-illustration" aria-hidden="true"><span className="illustration-sun">✦</span><span className="illustration-leaf leaf-one">⌁</span><span className="illustration-leaf leaf-two">⌁</span></div>
          <p className="aside-kicker">Small steps count</p>
          <h2>A little practice can make today feel brighter.</h2>
          <div className="aside-rule" />
          <p>Simple activities, clear instructions, and a pace that responds to you.</p>
        </aside>
      </main>
    )
  }

  const isCaregiver = mode === 'caregiver'
  const navItems = isCaregiver ? ['Dashboard', 'Patient Progress', 'Alerts', 'Reminders'] : ['Home', 'Games', 'Reminders', 'Progress', 'Voice Assistant']

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="wordmark" onClick={() => { setMode('welcome'); setActiveView('home') }}><span className="wordmark-mark">MC</span><span>MindCare</span></button>
        <div className="topbar-meta"><span className={`status-dot ${isOnline ? '' : 'offline'}`} /><span>{isOnline ? 'Online · saved on this device' : 'Offline · saved locally'}</span><select className="language-select" value={language} onChange={(event) => setLanguage(event.target.value)} aria-label="Choose language"><option>English</option><option>Hindi</option><option>Telugu</option><option>Assamese</option></select><button className="switch-link" onClick={() => setMode(isCaregiver ? 'elderly' : 'caregiver')}>Switch to {isCaregiver ? 'elderly view' : 'caregiver view'}</button></div>
      </header>
      <div className="app-layout">
        <nav className="side-nav" aria-label="Main navigation">
          <p className="nav-label">{isCaregiver ? 'Care team' : 'My day'}</p>
          {navItems.map((item, index) => <button className={`nav-item ${activeView === item.toLowerCase() ? 'active' : ''}`} key={item} onClick={() => setActiveView(item.toLowerCase())}><span className="nav-icon" aria-hidden="true">{['⌂', '◈', '◷', '▦', '◌'][index]}</span>{item}</button>)}
          <div className="nav-footer"><p>Need a little help?</p><button className="help-button">Speak with MindCare</button></div>
        </nav>
        <section className="content-area">
          <div className="content-heading"><div><p className="eyebrow">Wednesday, September 9, 2026</p><h1>{isCaregiver ? 'Good afternoon, caregiver' : 'Good morning, Ramesh'}</h1></div><div className="profile-chip"><span>RK</span><strong>{isCaregiver ? 'Caregiver' : 'Ramesh'}</strong></div></div>
          <div className="hero-banner"><div><p className="banner-kicker">A gentle start</p><h2>{isCaregiver ? 'Ramesh has completed 4 of 5 activities.' : 'Ready for today&apos;s activities?'}</h2><p>{isCaregiver ? 'His recent practice is moving in a positive direction.' : 'Choose one small activity. You can take your time.'}</p></div><span className="banner-mark" aria-hidden="true">✦</span></div>
          {activeView === 'games' ? <MemoryGame /> : activeView === 'attention' ? <AttentionGame /> : activeView === 'reminders' ? <RemindersView /> : activeView === 'progress' ? <ProgressView /> : activeView === 'voice assistant' ? <VoiceView onStartGame={() => setActiveView('games')} onShowProgress={() => setActiveView('progress')} /> : isCaregiver && (activeView === 'patient progress' || activeView === 'alerts') ? <CaregiverProgress /> : isCaregiver ? <div className="dashboard-grid"><article className="info-card large-card"><p className="card-label">Patient overview</p><h3>Ramesh Kumar</h3><p>Age 68 · Last active today</p><button className="text-action" onClick={() => setActiveView('patient progress')}>View patient progress <span>→</span></button></article><article className="info-card"><p className="card-label">Today&apos;s activity</p><strong className="metric">4<span>/5</span></strong><p>activities completed</p></article><article className="info-card"><p className="card-label">Game performance</p><strong className="metric">78<span>/100</span></strong><p className="positive-copy">Improving this week</p></article></div> : <><div className="action-grid"><button className="feature-card memory-card" onClick={() => setActiveView('games')}><span className="feature-icon" aria-hidden="true">✦</span><span><small>5 minutes</small><strong>Memory Training</strong><em>Remember familiar objects</em></span><b>→</b></button><button className="feature-card attention-card" onClick={() => setActiveView('attention')}><span className="feature-icon" aria-hidden="true">●</span><span><small>3 minutes</small><strong>Attention Training</strong><em>Notice what changes</em></span><b>→</b></button></div><div className="lower-grid"><article className="info-card"><p className="card-label">Today&apos;s reminders</p><h3>One thing at a time</h3><p>Medicine at 1:00 PM · Water at 2:00 PM</p><button className="text-action" onClick={() => setActiveView('reminders')}>View reminders <span>→</span></button></article><article className="info-card progress-card"><p className="card-label">My progress</p><strong className="metric">3<span> days</span></strong><p>practice streak</p><div className="progress-line"><span /></div></article></div></>}
        </section>
      </div>
    </main>
  )
}

export default App
