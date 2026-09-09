// LocalStorage manager for MindCare
// Persists demo patient Ramesh Kumar (Age 68), game scores, reminders, and AI state

const KEYS = {
  PATIENT: 'mindcare_patient_profile',
  REMINDERS: 'mindcare_reminders',
  HISTORY: 'mindcare_history',
  WEEKLY: 'mindcare_weekly',
  AI_STATE: 'mindcare_ai_state',
  PREFS: 'mindcare_preferences',
};

const DEFAULT_PATIENT = {
  id: 'pat-101',
  name: 'Ramesh Kumar',
  age: 68,
  primaryCaregiver: 'Anjali Kumar (Daughter)',
  cognitiveLevel: 'Good',
  statusTag: 'Consistent Engagement',
  notes: 'Monitoring early memory assistance. Responds warmly to visual picture cues.',
  avatar: '👴'
};

const DEFAULT_REMINDERS = [
  {
    id: 'rem-1',
    title: 'Take blood pressure medicine',
    time: '1:00 PM',
    category: 'medication',
    icon: '💊',
    completed: false,
    notes: '1 tablet after lunch with warm water'
  },
  {
    id: 'rem-2',
    title: 'Drink a glass of water',
    time: '11:30 AM',
    category: 'hydration',
    icon: '💧',
    completed: true,
    notes: 'Stay hydrated through morning'
  },
  {
    id: 'rem-3',
    title: 'Take a short garden walk',
    time: '4:30 PM',
    category: 'activity',
    icon: '🏃',
    completed: false,
    notes: '15 minutes gentle strolling with caregiver'
  },
  {
    id: 'rem-4',
    title: 'Doctor appointment with Dr. Sharma',
    time: '5:00 PM',
    category: 'appointment',
    icon: '🏥',
    completed: false,
    notes: 'Routine health checkup & vitals review'
  }
];

const DEFAULT_WEEKLY = [
  { day: 'Mon', score: 60, memoryScore: 62, attentionScore: 58 },
  { day: 'Tue', score: 65, memoryScore: 68, attentionScore: 62 },
  { day: 'Wed', score: 72, memoryScore: 70, attentionScore: 74 },
  { day: 'Thu', score: 70, memoryScore: 72, attentionScore: 68 },
  { day: 'Fri', score: 78, memoryScore: 80, attentionScore: 76 },
  { day: 'Sat', score: 82, memoryScore: 85, attentionScore: 79 },
  { day: 'Sun', score: 85, memoryScore: 88, attentionScore: 82 },
];

const DEFAULT_HISTORY = [
  {
    id: 'sess-1',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    game: 'Memory Training',
    type: 'memory',
    score: 85,
    difficulty: 'Medium',
    responseTime: 3.8,
    details: '5/6 items recalled accurately'
  },
  {
    id: 'sess-2',
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
    game: 'Attention Training',
    type: 'attention',
    score: 80,
    difficulty: 'Medium',
    responseTime: 2.4,
    details: 'Quick color recognition'
  },
  {
    id: 'sess-3',
    timestamp: new Date(Date.now() - 3600000 * 72).toISOString(),
    game: 'Memory Training',
    type: 'memory',
    score: 75,
    difficulty: 'Easy',
    responseTime: 4.2,
    details: '3/4 items recalled'
  }
];

const DEFAULT_AI_STATE = {
  memoryDifficulty: 'Medium',     // Easy, Medium, Hard
  attentionDifficulty: 'Medium',  // Easy, Medium, Hard
  lastAdjustment: {
    game: 'Memory Training',
    previousLevel: 'Easy',
    newLevel: 'Medium',
    score: 85,
    reason: 'Performance exceeded 80% threshold',
    timestamp: new Date().toISOString()
  },
  simulatedDrop: false,
  dropAlertDismissed: false
};

const DEFAULT_PREFS = {
  language: 'en',
  highContrast: false,
  textLarge: false,
  soundEnabled: true,
  simulatedOffline: false
};

// Initialization helper
export const initStorage = () => {
  if (!localStorage.getItem(KEYS.PATIENT)) {
    localStorage.setItem(KEYS.PATIENT, JSON.stringify(DEFAULT_PATIENT));
  }
  if (!localStorage.getItem(KEYS.REMINDERS)) {
    localStorage.setItem(KEYS.REMINDERS, JSON.stringify(DEFAULT_REMINDERS));
  }
  if (!localStorage.getItem(KEYS.WEEKLY)) {
    localStorage.setItem(KEYS.WEEKLY, JSON.stringify(DEFAULT_WEEKLY));
  }
  if (!localStorage.getItem(KEYS.HISTORY)) {
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(DEFAULT_HISTORY));
  }
  if (!localStorage.getItem(KEYS.AI_STATE)) {
    localStorage.setItem(KEYS.AI_STATE, JSON.stringify(DEFAULT_AI_STATE));
  }
  if (!localStorage.getItem(KEYS.PREFS)) {
    localStorage.setItem(KEYS.PREFS, JSON.stringify(DEFAULT_PREFS));
  }
};

export const getPatientProfile = () => {
  try {
    const data = localStorage.getItem(KEYS.PATIENT);
    return data ? JSON.parse(data) : DEFAULT_PATIENT;
  } catch (e) {
    return DEFAULT_PATIENT;
  }
};

export const getReminders = () => {
  try {
    const data = localStorage.getItem(KEYS.REMINDERS);
    return data ? JSON.parse(data) : DEFAULT_REMINDERS;
  } catch (e) {
    return DEFAULT_REMINDERS;
  }
};

export const saveReminders = (reminders) => {
  localStorage.setItem(KEYS.REMINDERS, JSON.stringify(reminders));
};

export const toggleReminder = (id) => {
  const current = getReminders();
  const updated = current.map(r => r.id === id ? { ...r, completed: !r.completed } : r);
  saveReminders(updated);
  return updated;
};

export const addReminder = (reminder) => {
  const current = getReminders();
  const newItem = {
    ...reminder,
    id: `rem-${Date.now()}`,
    completed: false
  };
  const updated = [newItem, ...current];
  saveReminders(updated);
  return updated;
};

export const deleteReminder = (id) => {
  const current = getReminders();
  const updated = current.filter(r => r.id !== id);
  saveReminders(updated);
  return updated;
};

export const getWeeklyData = () => {
  try {
    const data = localStorage.getItem(KEYS.WEEKLY);
    return data ? JSON.parse(data) : DEFAULT_WEEKLY;
  } catch (e) {
    return DEFAULT_WEEKLY;
  }
};

export const getGameHistory = () => {
  try {
    const data = localStorage.getItem(KEYS.HISTORY);
    return data ? JSON.parse(data) : DEFAULT_HISTORY;
  } catch (e) {
    return DEFAULT_HISTORY;
  }
};

export const recordGameSession = (session) => {
  const current = getGameHistory();
  const newSession = {
    ...session,
    id: `sess-${Date.now()}`,
    timestamp: new Date().toISOString()
  };
  const updated = [newSession, ...current].slice(0, 20);
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(updated));

  // Also update today's weekly score point
  const weekly = getWeeklyData();
  const todayIdx = weekly.length - 1;
  if (todayIdx >= 0) {
    const prev = weekly[todayIdx];
    const newScore = Math.round((prev.score + session.score) / 2);
    if (session.type === 'memory') {
      weekly[todayIdx].memoryScore = session.score;
    } else {
      weekly[todayIdx].attentionScore = session.score;
    }
    weekly[todayIdx].score = newScore;
    localStorage.setItem(KEYS.WEEKLY, JSON.stringify([...weekly]));
  }

  return updated;
};

export const getAIState = () => {
  try {
    const data = localStorage.getItem(KEYS.AI_STATE);
    return data ? JSON.parse(data) : DEFAULT_AI_STATE;
  } catch (e) {
    return DEFAULT_AI_STATE;
  }
};

export const saveAIState = (aiState) => {
  localStorage.setItem(KEYS.AI_STATE, JSON.stringify(aiState));
};

export const getPreferences = () => {
  try {
    const data = localStorage.getItem(KEYS.PREFS);
    return data ? JSON.parse(data) : DEFAULT_PREFS;
  } catch (e) {
    return DEFAULT_PREFS;
  }
};

export const savePreferences = (prefs) => {
  localStorage.setItem(KEYS.PREFS, JSON.stringify(prefs));
};

export const resetAllDemoData = () => {
  localStorage.setItem(KEYS.PATIENT, JSON.stringify(DEFAULT_PATIENT));
  localStorage.setItem(KEYS.REMINDERS, JSON.stringify(DEFAULT_REMINDERS));
  localStorage.setItem(KEYS.WEEKLY, JSON.stringify(DEFAULT_WEEKLY));
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(DEFAULT_HISTORY));
  localStorage.setItem(KEYS.AI_STATE, JSON.stringify(DEFAULT_AI_STATE));
  localStorage.setItem(KEYS.PREFS, JSON.stringify(DEFAULT_PREFS));
};
