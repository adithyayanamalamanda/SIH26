/**
 * API Client for MindCare NER Cognitive Module Backend (FastAPI).
 * Connects to http://localhost:8000 with transparent offline fallback.
 */

const BACKEND_URL = 'http://localhost:8000';

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/health`, { method: 'GET' });
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err) {
    console.warn('Backend offline or unreachable, will use local fallback:', err.message);
    return null;
  }
}

export async function apiStartGame(patientId = 'P001', requestedLevel = null) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/game/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId, requestedLevel })
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Using local fallback for apiStartGame:', err.message);
    return fallbackStartGame(patientId, requestedLevel);
  }
}

export async function apiSubmitGame(payload) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/game/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Using local fallback for apiSubmitGame:', err.message);
    return fallbackSubmitGame(payload);
  }
}

export async function apiGetHistory(patientId = 'P001') {
  try {
    const res = await fetch(`${BACKEND_URL}/api/patient/${patientId}/history`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Using local fallback for apiGetHistory:', err.message);
    return fallbackGetHistory(patientId);
  }
}

export async function apiTranscribeTextCommand(text) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/voice/transcribe-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Using local fallback for voice command:', err.message);
    const lower = text.toLowerCase();
    let cmd = null;
    if (lower.includes('start') || lower.includes('play')) cmd = 'start_game';
    else if (lower.includes('hint') || lower.includes('help')) cmd = 'hint';
    else if (lower.includes('submit') || lower.includes('done')) cmd = 'submit';
    else if (lower.includes('home') || lower.includes('back')) cmd = 'home';
    return {
      transcription: text,
      detectedCommand: cmd,
      confidence: 0.9,
      modelUsed: 'openai/whisper-small (fallback-client)'
    };
  }
}

/* ================= Local Fallback Implementations ================= */

const FALLBACK_OBJECTS = [
  { id: 'assam_tea_cup', label: 'Tea Cup', regional_label: 'Chah Cup (Assam Tea)', emoji: '☕', icon_color: '#D97706' },
  { id: 'gamusa_shawl', label: 'Traditional Towel / Gamusa', regional_label: 'Gamosa / Gamusa', emoji: '🧣', icon_color: '#DC2626' },
  { id: 'clay_lantern', label: 'Clay Lantern / Diya', regional_label: 'Chaki / Diya', emoji: '🪔', icon_color: '#F59E0B' },
  { id: 'temple_bell', label: 'Brass Bell', regional_label: 'Ghyanta / Bell', emoji: '🔔', icon_color: '#EAB308' },
  { id: 'marigold_flower', label: 'Marigold Flower', regional_label: 'Gendha Phool', emoji: '🌼', icon_color: '#F97316' },
  { id: 'banana_leaf', label: 'Banana Leaf', regional_label: 'Kola Paat', emoji: '🍃', icon_color: '#16A34A' },
  { id: 'jaapi_hat', label: 'Bamboo Sun Hat / Jaapi', regional_label: 'Assamese Jaapi', emoji: '👒', icon_color: '#CA8A04' },
  { id: 'bamboo_basket', label: 'Bamboo Basket', regional_label: 'Dala / Khang', emoji: '🧺', icon_color: '#A16207' },
  { id: 'bamboo_flute', label: 'Bamboo Flute', regional_label: 'Bahi / Flute', emoji: '🪈', icon_color: '#854D0E' },
  { id: 'dhol_drum', label: 'Folk Drum / Dhol', regional_label: 'Bihu Dhol', emoji: '🥁', icon_color: '#B91C1C' },
  { id: 'brass_water_jug', label: 'Brass Water Jug', regional_label: 'Kalah / Lota', emoji: '🫖', icon_color: '#D97706' },
  { id: 'reading_glasses', label: 'Reading Glasses', regional_label: 'Choshma', emoji: '👓', icon_color: '#0284C7' }
];

function fallbackStartGame(patientId, requestedLevel) {
  const level = requestedLevel || 1;
  const countMap = { 1: 4, 2: 6, 3: 8, 4: 10 };
  const secMap = { 1: 5, 2: 5, 3: 4, 4: 3 };
  const targetCount = countMap[level] || 4;
  const viewingSeconds = secMap[level] || 5;

  const shuffled = [...FALLBACK_OBJECTS].sort(() => 0.5 - Math.random());
  const targets = shuffled.slice(0, targetCount);
  const remaining = shuffled.slice(targetCount);
  const distractors = remaining.slice(0, 4);
  const selectionPool = [...targets, ...distractors].sort(() => 0.5 - Math.random());

  return {
    sessionId: `local_${Date.now()}`,
    patientId,
    difficultyLevel: level,
    levelName: `Level ${level}`,
    viewingSeconds,
    targetObjects: targets,
    selectionPool,
    totalTargetCount: targets.length,
    totalPoolCount: selectionPool.length,
    instructions: `Remember these ${targets.length} objects. You have ${viewingSeconds} seconds.`
  };
}

function fallbackSubmitGame(payload) {
  const targetSet = new Set(payload.targetObjectIds);
  const selectedSet = new Set(payload.selectedObjectIds);

  const correct = [...selectedSet].filter(x => targetSet.has(x));
  const incorrect = [...selectedSet].filter(x => !targetSet.has(x));
  const missed = [...targetSet].filter(x => !selectedSet.has(x));

  const accuracy = Math.round((correct.length / targetSet.size) * 100);
  let score = accuracy;
  if (payload.responseTime <= 20) score += 5;
  score -= (incorrect.length * 6 + (payload.hintsUsed || 0) * 4);
  score = Math.max(0, Math.min(100, Math.round(score)));

  let nextLevel = payload.difficultyLevel;
  if (score >= 80) nextLevel = Math.min(nextLevel + 1, 4);
  else if (score < 60) nextLevel = Math.max(nextLevel - 1, 1);

  return {
    sessionId: payload.sessionId,
    patientId: payload.patientId,
    gameType: 'memory_recall',
    difficultyLevel: payload.difficultyLevel,
    objectsShown: payload.targetObjectIds,
    correctAnswers: correct,
    incorrectAnswers: incorrect,
    missedAnswers: missed,
    correctCount: correct.length,
    incorrectCount: incorrect.length,
    missedCount: missed.length,
    accuracy,
    responseTime: payload.responseTime,
    attempts: payload.attempts,
    hintsUsed: payload.hintsUsed,
    performanceScore: score,
    nextDifficultyLevel: nextLevel,
    adaptiveAction: score >= 80 ? 'increase' : score >= 60 ? 'maintain' : 'decrease',
    feedbackMessage: score >= 80 ? 'Outstanding recall! Ready for next level.' : 'Good effort! Continuing practice.',
    scoreBreakdown: {
      accuracyScore: accuracy,
      timeScore: 5,
      mistakePenalty: incorrect.length * 6,
      hintPenalty: (payload.hintsUsed || 0) * 4,
      rawScore: score,
      finalScore: score,
      explanation: `Accuracy ${accuracy}%, Mistakes: -${incorrect.length * 6} pts, Hints: -${(payload.hintsUsed || 0) * 4} pts.`
    },
    timestamp: new Date().toISOString()
  };
}

function fallbackGetHistory(patientId) {
  return {
    patientId,
    currentLevel: 1,
    totalSessions: 0,
    averageAccuracy: 0,
    averageResponseTime: 0,
    averageScore: 0,
    sessions: []
  };
}
