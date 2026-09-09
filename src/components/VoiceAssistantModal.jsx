import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  X,
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { translations } from '../services/translations';
import {
  isSpeechRecognitionSupported,
  startListening,
  processVoiceCommand,
  speakText,
  stopSpeaking
} from '../services/speech';

export default function VoiceAssistantModal({
  isOpen,
  onClose,
  setCurrentView,
  language
}) {
  if (!isOpen) return null;

  const t = translations[language] || translations.en;
  const supported = isSpeechRecognitionSupported();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [assistantReply, setAssistantReply] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  const recognitionRef = useRef(null);

  const handleStartListening = () => {
    if (!supported) {
      setErrorMsg(t.voice.notSupported);
      return;
    }

    setErrorMsg(null);
    setTranscript('');
    setIsListening(true);

    recognitionRef.current = startListening({
      lang: language,
      onResult: (text) => {
        setTranscript(text);
        setIsListening(false);
        handleExecuteCommand(text);
      },
      onError: (err) => {
        console.warn('Voice error:', err);
        setIsListening(false);
        setErrorMsg('Could not catch your voice. Please try again or tap a suggestion.');
      },
      onEnd: () => {
        setIsListening(false);
      }
    });
  };

  const handleStopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  };

  const handleExecuteCommand = (text) => {
    const result = processVoiceCommand(text);
    setAssistantReply(result.reply);
    speakText(result.reply, language);

    if (result.target) {
      setTimeout(() => {
        setCurrentView(result.target);
        onClose();
      }, 1600);
    }
  };

  const handleQuickCommand = (cmdText) => {
    setTranscript(cmdText);
    handleExecuteCommand(cmdText);
  };

  useEffect(() => {
    // Auto-prompt initial greeting
    speakText('MindCare is listening. How can I assist you today?', language);
    handleStartListening();

    return () => {
      stopSpeaking();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border-2 border-teal-200 animate-in fade-in zoom-in-95 duration-200 relative text-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          aria-label="Close voice assistant"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-teal-600" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t.voice.title}
          </h2>
        </div>
        <p className="text-sm sm:text-base text-slate-500 mb-6">
          {t.voice.speakPrompt}
        </p>

        {/* Large Microphone Action Circle with Waveform Animation */}
        <div className="flex flex-col items-center justify-center mb-6">
          <button
            onClick={isListening ? handleStopListening : handleStartListening}
            className={`w-28 h-28 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 relative ${
              isListening
                ? 'bg-rose-500 hover:bg-rose-600 ring-8 ring-rose-200 scale-105 animate-pulse'
                : 'bg-teal-600 hover:bg-teal-700 ring-8 ring-teal-100 hover:scale-105'
            }`}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
          >
            {isListening ? (
              <MicOff className="w-12 h-12 text-white" />
            ) : (
              <Mic className="w-12 h-12 text-white" />
            )}
          </button>

          {/* Audio Waveform effect when listening */}
          {isListening ? (
            <div className="flex items-center gap-1.5 mt-4 h-6">
              <span className="w-1.5 h-6 bg-teal-600 rounded-full wave-bar" />
              <span className="w-1.5 h-6 bg-teal-600 rounded-full wave-bar" />
              <span className="w-1.5 h-6 bg-teal-600 rounded-full wave-bar" />
              <span className="w-1.5 h-6 bg-teal-600 rounded-full wave-bar" />
              <span className="w-1.5 h-6 bg-teal-600 rounded-full wave-bar" />
              <span className="text-sm font-bold text-teal-700 ml-2 animate-pulse">
                {t.voice.listening}
              </span>
            </div>
          ) : (
            <span className="text-sm font-semibold text-slate-500 mt-4">
              Tap mic to speak
            </span>
          )}
        </div>

        {/* Live Transcript / Result Bubble */}
        {transcript && (
          <div className="mb-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left">
            <span className="text-xs font-bold text-slate-400 block mb-1">You said:</span>
            <p className="text-lg font-bold text-slate-800 italic">
              "{transcript}"
            </p>
          </div>
        )}

        {/* Assistant Response Bubble */}
        {assistantReply && (
          <div className="mb-6 p-4 rounded-2xl bg-teal-50 border border-teal-200 text-left flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 text-sm font-bold mt-0.5">
              🤖
            </div>
            <div>
              <span className="text-xs font-bold text-teal-800 block mb-1">MindCare:</span>
              <p className="text-base font-semibold text-teal-950">
                {assistantReply}
              </p>
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-800 flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Quick Command Suggestions (Elderly Friendly Fallback) */}
        <div className="border-t border-slate-100 pt-4 text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
            {t.voice.quickCommands}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickCommand('Start memory game')}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-800 font-bold text-xs sm:text-sm text-left transition flex items-center justify-between group"
            >
              <span>🧠 {t.voice.cmdMemory}</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
            </button>
            <button
              onClick={() => handleQuickCommand('Start attention training')}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-sky-50 hover:text-sky-800 text-slate-800 font-bold text-xs sm:text-sm text-left transition flex items-center justify-between group"
            >
              <span>🎯 {t.voice.cmdAttention}</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600" />
            </button>
            <button
              onClick={() => handleQuickCommand('Show reminders')}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-800 font-bold text-xs sm:text-sm text-left transition flex items-center justify-between group"
            >
              <span>⏰ {t.voice.cmdReminders}</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
            </button>
            <button
              onClick={() => handleQuickCommand('What should I do now?')}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-800 font-bold text-xs sm:text-sm text-left transition flex items-center justify-between group"
            >
              <span>💡 {t.voice.cmdWhatNext}</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
