const commands = [
  { action: 'elderly', phrases: ['elderly user', 'elderly view', 'user view', 'switch to user'] },
  { action: 'caregiver', phrases: ['caregiver', 'caregiver view', 'switch to caregiver', 'care team'] },
  { action: 'home', phrases: ['go home', 'open home', 'take me home', 'home screen'] },
  { action: 'games', phrases: ['open games', 'memory game', 'memory training', 'start memory', 'start a game', 'play a game', 'games'] },
  { action: 'attention', phrases: ['attention game', 'attention training', 'start attention', 'open attention', 'play attention'] },
  { action: 'reminders', phrases: ['open reminders', 'show reminders', 'my reminders', 'reminder list', 'reminders'] },
  { action: 'progress', phrases: ['show progress', 'open progress', 'my progress', 'game history', 'progress'] },
  { action: 'dashboard', phrases: ['open dashboard', 'show dashboard', 'caregiver dashboard', 'dashboard'] },
  { action: 'patient progress', phrases: ['patient progress', 'show patient progress', 'ramesh progress'] },
  { action: 'alerts', phrases: ['open alerts', 'show alerts', 'care alerts', 'alerts'] },
  { action: 'voice assistant', phrases: ['voice assistant', 'open voice assistant', 'what can i say', 'command help', 'help'] },
  { action: 'back', phrases: ['go back', 'previous page', 'back'] },
]

export function parseVoiceCommand(transcript) {
  const text = transcript.trim().toLowerCase().replace(/[.,!?]/g, '').replace(/\s+/g, ' ')
  if (!text) return null
  const directMatch = commands.find(({ phrases }) => phrases.some((phrase) => text === phrase || text.includes(phrase)))
  if (directMatch) return directMatch.action
  const ignored = ['please', 'can', 'you', 'take', 'me', 'to', 'the', 'my', 'show', 'open', 'start', 'go', 'want', 'i']
  const words = text.split(' ').filter((word) => !ignored.includes(word))
  let bestMatch = null
  let bestScore = 0
  for (const command of commands) {
    for (const phrase of command.phrases) {
      const phraseWords = phrase.split(' ').filter((word) => !ignored.includes(word))
      const score = phraseWords.filter((word) => words.includes(word)).length / phraseWords.length
      if (score > bestScore) { bestScore = score; bestMatch = command.action }
    }
  }
  return bestScore >= 0.6 ? bestMatch : null
}

export function voiceCommandHelp(isCaregiver) {
  const common = 'Try “take me to memory training”, “open reminders”, “show my progress”, “go back”, or “what can I say?”'
  return isCaregiver ? `${common} You can also say dashboard, patient progress, alerts, or elderly view.` : `${common} You can also say caregiver view.`
}