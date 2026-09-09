import React from 'react';
import { Play, Volume2, Mic, Sparkles, Award, ShieldCheck } from 'lucide-react';

export default function WelcomeHome({
  patientId,
  currentLevel,
  onStartGame,
  onSelectLevel,
  isListening,
  onTriggerVoice,
  voiceFeedback,
  speakText,
  highContrast
}) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col items-center text-center">
      {/* Patient & Safety Header */}
      <div className="w-full flex items-center justify-between mb-8 p-4 rounded-2xl bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700">
        <div className="flex items-center space-x-3 text-left">
          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
            {patientId.slice(0, 2)}
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">Patient Identifier</p>
            <p className="text-xl font-bold text-slate-800 dark:text-white">{patientId} • NER Cohort</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-4 py-2 rounded-xl text-base font-bold">
          <Award className="w-5 h-5" />
          <span>Current Level: {currentLevel}</span>
        </div>
      </div>

      {/* Main App Title */}
      <div className="mb-6">
        <span className="inline-block px-4 py-1 rounded-full text-sm font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 mb-3">
          SIH 2026 Problem Statement 26003
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
          Adaptive Memory Recall Game
        </h1>
        <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          A gentle, friendly cognitive exercise designed to stimulate memory recall with familiar everyday objects.
        </p>
      </div>

      {/* Primary Action Button (Giant & Touch Friendly) */}
      <div className="w-full max-w-md my-6">
        <button
          onClick={() => {
            speakText("Starting the memory game. Let's get ready!");
            onStartGame();
          }}
          className={`w-full py-6 px-8 rounded-3xl font-extrabold text-2xl sm:text-3xl shadow-xl transform active:scale-95 transition-all flex items-center justify-center space-x-4 ${
            highContrast
              ? 'bg-amber-400 hover:bg-amber-300 text-black border-4 border-white'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/25'
          }`}
          style={{ minHeight: '80px' }}
        >
          <Play className="w-10 h-10 fill-current" />
          <span>Start Memory Game</span>
        </button>
      </div>

      {/* Voice Interaction Card */}
      <div className="w-full max-w-md p-5 rounded-2xl bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 mb-8">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <p className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
              <Mic className="w-5 h-5 text-indigo-500" />
              <span>Voice Control (Whisper)</span>
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Say &quot;Start Game&quot; or &quot;Help&quot;
            </p>
          </div>
          <button
            onClick={onTriggerVoice}
            className={`px-5 py-3 rounded-xl font-bold text-base flex items-center gap-2 transition-all ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
            }`}
          >
            <Mic className="w-5 h-5" />
            <span>{isListening ? 'Listening...' : 'Tap to Speak'}</span>
          </button>
        </div>
        {voiceFeedback && (
          <div className="mt-3 p-2 bg-indigo-50 dark:bg-indigo-900/50 rounded-lg text-sm text-indigo-700 dark:text-indigo-200 text-left">
            {voiceFeedback}
          </div>
        )}
      </div>

      {/* Difficulty Level Selector for Testing */}
      <div className="w-full max-w-xl p-5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Select Starting Difficulty
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { lvl: 1, label: 'Level 1', desc: '4 items • 5s' },
            { lvl: 2, label: 'Level 2', desc: '6 items • 5s' },
            { lvl: 3, label: 'Level 3', desc: '8 items • 4s' },
            { lvl: 4, label: 'Level 4', desc: '10 items • 3s' }
          ].map((item) => (
            <button
              key={item.lvl}
              onClick={() => onSelectLevel(item.lvl)}
              className={`p-3 rounded-xl text-center border-2 transition-all ${
                currentLevel === item.lvl
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 font-extrabold text-blue-700 dark:text-blue-300 shadow-sm'
                  : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="text-lg font-bold">{item.label}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Clinical Transparency Notice */}
      <div className="mt-8 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 max-w-xl">
        <ShieldCheck className="w-4 h-4 flex-shrink-0 text-slate-400" />
        <span>
          Non-clinical cognitive exercise tool. This application does not claim to diagnose or treat medical conditions. Personalization is powered by an auditable adaptive difficulty engine.
        </span>
      </div>
    </div>
  );
}
