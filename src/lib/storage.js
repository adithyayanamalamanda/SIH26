const SESSION_KEY = 'mindcare.game-sessions'
const REMINDER_KEY = 'mindcare.reminders'
const SYNC_KEY = 'mindcare.sync-status'
const MAX_SESSIONS = 100
const STORAGE_EVENT = 'mindcare-storage-change'

function notifyStorageChange() {
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT))
}

function readJson(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
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
  const saved = writeJson(SESSION_KEY, [...readGameSessions(), session].slice(-MAX_SESSIONS))
  if (saved) {
    saveSyncStatus(navigator.onLine ? 'online-local-only' : 'offline-local-only')
    notifyStorageChange()
  }
  return saved
}

export function readGameSessions() {
  const sessions = readJson(SESSION_KEY, [])
  if (!Array.isArray(sessions)) return []
  return sessions.filter((session) => (
    session
    && typeof session === 'object'
    && typeof session.gameType === 'string'
    && Number.isFinite(session.performanceScore)
    && Number.isFinite(session.accuracy)
    && typeof session.timestamp === 'string'
  ))
}

export function readCurrentDifficulty(gameType) {
  const latestSession = readGameSessions().filter((session) => session.gameType === gameType).at(-1)
  const nextLevel = latestSession?.nextDifficultyLevel
  return Number.isInteger(nextLevel) ? Math.max(1, Math.min(4, nextLevel)) : 1
}

export function readReminders(fallback = []) {
  const reminders = readJson(REMINDER_KEY, fallback)
  if (!Array.isArray(reminders)) return fallback
  return reminders.filter((reminder) => (
    reminder
    && typeof reminder === 'object'
    && typeof reminder.id !== 'undefined'
    && typeof reminder.text === 'string'
    && typeof reminder.time === 'string'
    && typeof reminder.done === 'boolean'
  ))
}

export function saveReminders(reminders) {
  const saved = writeJson(REMINDER_KEY, reminders)
  if (saved) notifyStorageChange()
  return saved
}

export function subscribeToStorageChanges(listener) {
  window.addEventListener(STORAGE_EVENT, listener)
  window.addEventListener('storage', listener)
  return () => {
    window.removeEventListener(STORAGE_EVENT, listener)
    window.removeEventListener('storage', listener)
  }
}

export function readSyncStatus() {
  return readJson(SYNC_KEY, { status: navigator.onLine ? 'online-local-only' : 'offline-local-only', updatedAt: null })
}

export function saveSyncStatus(status) {
  return writeJson(SYNC_KEY, { status, updatedAt: new Date().toISOString() })
}
