const SESSION_KEY = 'mindcare.game-sessions'
const REMINDER_KEY = 'mindcare.reminders'
const SYNC_KEY = 'mindcare.sync-status'

function readJson(key, fallback) {
  try {
    return JSON.parse(window.localStorage.getItem(key) || JSON.stringify(fallback))
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function saveGameSession(session) {
  const saved = writeJson(SESSION_KEY, [...readGameSessions(), session])
  if (saved) writeJson(SYNC_KEY, { status: navigator.onLine ? 'synced' : 'pending', updatedAt: new Date().toISOString() })
  return saved
}

export function readGameSessions() {
  return readJson(SESSION_KEY, [])
}

export function readReminders(fallback = []) {
  return readJson(REMINDER_KEY, fallback)
}

export function saveReminders(reminders) {
  return writeJson(REMINDER_KEY, reminders)
}

export function readSyncStatus() {
  return readJson(SYNC_KEY, { status: navigator.onLine ? 'synced' : 'pending', updatedAt: null })
}

export function saveSyncStatus(status) {
  return writeJson(SYNC_KEY, { status, updatedAt: new Date().toISOString() })
}
