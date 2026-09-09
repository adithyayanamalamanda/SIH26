const commands = [
  { action: 'elderly', phrases: ['elderly user', 'elderly view', 'user view'] },
  { action: 'caregiver', phrases: ['caregiver', 'caregiver view'] },
  { action: 'home', phrases: ['go home', 'open home', 'home'] },
  { action: 'games', phrases: ['open games', 'memory game', 'start memory', 'start a game', 'games'] },
  { action: 'attention', phrases: ['attention game', 'start attention', 'open attention', 'attention'] },
  { action: 'reminders', phrases: ['open reminders', 'show reminders', 'reminders', 'reminder list'] },
  { action: 'progress', phrases: ['show progress', 'open progress', 'my progress', 'progress'] },
  { action: 'dashboard', phrases: ['open dashboard', 'show dashboard', 'dashboard'] },
  { action: 'patient progress', phrases: ['patient progress', 'show patient progress'] },
  { action: 'alerts', phrases: ['open alerts', 'show alerts', 'alerts'] },
  { action: 'voice assistant', phrases: ['voice assistant', 'open voice assistant', 'help'] },
  { action: 'back', phrases: ['go back', 'back'] },
]

export function parseVoiceCommand(transcript) {
  const text = transcript.trim().toLowerCase().replace(/[.,!?]/g, '')
  if (!text) return null
  return commands.find(({ phrases }) => phrases.some((phrase) => text === phrase || text.includes(phrase)))?.action || null
}

export function voiceCommandHelp(isCaregiver) {
  const common = 'Say home, games, attention, reminders, progress, go back, or help.'
  return isCaregiver ? `${common} You can also say dashboard, patient progress, alerts, or elderly view.` : `${common} You can also say caregiver view.`
}