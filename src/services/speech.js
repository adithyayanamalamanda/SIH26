// Web Speech API service: Speech Recognition & Text-to-Speech (TTS)
// Provides accessibility and voice-assisted interaction for elderly users

export const isSpeechRecognitionSupported = () => {
  return typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
};

export const isSpeechSynthesisSupported = () => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

/**
 * Text-to-Speech readout
 * @param {string} text - text to speak aloud
 * @param {string} lang - 'en' | 'hi' | 'te' | 'as'
 */
export const speakText = (text, lang = 'en') => {
  if (!isSpeechSynthesisSupported()) return;

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.88; // Slightly slower, calm cadence for elderly clarity
    utterance.pitch = 1.0;

    // Language mapping for synthesis
    const langCodes = {
      en: 'en-US',
      hi: 'hi-IN',
      te: 'te-IN',
      as: 'as-IN'
    };
    utterance.lang = langCodes[lang] || 'en-US';

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
};

export const stopSpeaking = () => {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
};

/**
 * Creates and starts speech recognition instance
 * @param {Object} callbacks - { onResult, onError, onEnd }
 * @param {string} lang - language code
 */
export const startListening = ({ onResult, onError, onEnd, lang = 'en' }) => {
  if (!isSpeechRecognitionSupported()) {
    if (onError) onError('Speech recognition not supported in this browser.');
    return null;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  const langCodes = {
    en: 'en-US',
    hi: 'hi-IN',
    te: 'te-IN',
    as: 'as-IN'
  };

  recognition.lang = langCodes[lang] || 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if (onResult) onResult(transcript);
  };

  recognition.onerror = (event) => {
    if (onError) onError(event.error);
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  try {
    recognition.start();
    return recognition;
  } catch (e) {
    if (onError) onError(e.message);
    return null;
  }
};

/**
 * Maps voice transcripts to navigation actions
 */
export const processVoiceCommand = (transcript) => {
  const t = transcript.toLowerCase();

  if (t.includes('memory') || t.includes('card') || t.includes('याद') || t.includes('జ్ఞాపక')) {
    return {
      action: 'NAVIGATE',
      target: 'memory',
      reply: 'Starting your memory card activity now.'
    };
  }

  if (t.includes('attention') || t.includes('focus') || t.includes('color') || t.includes('एकाग्रता') || t.includes('ఏకాగ్రత')) {
    return {
      action: 'NAVIGATE',
      target: 'attention',
      reply: 'Opening your attention and focus activity.'
    };
  }

  if (t.includes('reminder') || t.includes('medicine') || t.includes('water') || t.includes('दवा') || t.includes('मందు')) {
    return {
      action: 'NAVIGATE',
      target: 'reminders',
      reply: 'Here are your reminders for today.'
    };
  }

  if (t.includes('progress') || t.includes('score') || t.includes('प्रगति') || t.includes('పురోగతి')) {
    return {
      action: 'NAVIGATE',
      target: 'progress',
      reply: 'Opening your progress and achievements summary.'
    };
  }

  if (t.includes('home') || t.includes('main') || t.includes('घर') || t.includes('హోమ్')) {
    return {
      action: 'NAVIGATE',
      target: 'elderly_dashboard',
      reply: 'Returning to your home dashboard.'
    };
  }

  if (t.includes('what should i do') || t.includes('help') || t.includes('what next') || t.includes('क्या करूं') || t.includes('ఏమి చేయాలి')) {
    return {
      action: 'SUGGEST',
      target: null,
      reply: 'Good to have you here! You have a memory training activity ready, and your afternoon medicine is scheduled at 1:00 PM.'
    };
  }

  return {
    action: 'UNKNOWN',
    target: null,
    reply: `I heard: "${transcript}". You can say "Start memory game", "Show reminders", or "My progress".`
  };
};
