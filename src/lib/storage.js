const SESSION_KEY = 'mindcare.game-sessions'

export function saveGameSession(session) {
  const existing = readGameSessions()
  window.localStorage.setItem(SESSION_KEY, JSON.stringify([...existing, session]))
}

export function readGameSessions() {
  try {
    return JSON.parse(window.localStorage.getItem(SESSION_KEY) || '[]')
  } catch {
    return []
  }
}
