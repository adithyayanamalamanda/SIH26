import React from 'react';
import {
  Brain,
  Volume2,
  Calendar,
  Sparkles,
  Award,
  Clock,
  Mic,
  Droplets,
  Pill
} from 'lucide-react';
import { translations } from '../services/translations';
import { speakText } from '../services/speech';

export default function ElderlyDashboard({
  setCurrentView,
  language = 'en',
  onOpenVoiceAssistant,
  onStartMemoryGame,
  highContrast
}) {
  const t = translations[language] || translations.en;

  const todayDateString = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const handleReadGreeting = () => {
    speakText(
      `Good morning, Ramesh! Ready for today's gentle activities? You have completed 2 cognitive games today, and your next medicine reminder is at 1 PM. Have a wonderful day!`
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 flex flex-col items-center">
      {/* Friendly Elderly Welcome Banner */}
      <div className="w-full p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-slate-700 shadow-sm mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold text-sm mb-1">
            <Calendar className="w-4 h-4" />
            <span>{todayDateString}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Good Morning, Ramesh 👋
            </h1>
            <button
              onClick={handleReadGreeting}
              className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 hover:bg-blue-100 transition"
              title="Read greeting aloud"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </div>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mt-1 font-medium">
            Ready for today&apos;s gentle cognitive activities?
          </p>
        </div>

        {/* Next Reminder Highlight Pill */}
        <div className="px-4 py-3 rounded-2xl bg-amber-50 dark:bg-amber-950 border border-amber-300 dark:border-amber-800 text-left">
          <p className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase">Next Reminder</p>
          <p className="text-base font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5 mt-0.5">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>1:00 PM • Blood Pressure Pill</span>
          </p>
        </div>
      </div>

      {/* Today's Summary Row (Progress + Games completed) */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
          <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase">Today&apos;s Progress</p>
          <p className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
            85% Score
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center">
          <p className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase">Games Completed</p>
          <p className="text-2xl sm:text-3xl font-black text-blue-700 dark:text-blue-400 mt-1">
            3 Rounds
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 text-center col-span-2 sm:col-span-1">
          <p className="text-xs font-bold text-cyan-800 dark:text-cyan-300 uppercase">Water Intake</p>
          <p className="text-2xl sm:text-3xl font-black text-cyan-700 dark:text-cyan-400 mt-1">
            5 / 8 Glasses
          </p>
        </div>
      </div>

      {/* 5 EXACT GIANT BUTTONS (Section 7 Specifications) */}
      <div className="w-full space-y-4 mb-8">
        {/* 1. PLAY COGNITIVE GAME */}
        <button
          onClick={() => setCurrentView('memory')}
          className={`w-full py-6 px-8 rounded-3xl font-black text-2xl sm:text-3xl shadow-xl flex items-center justify-between transition-all transform active:scale-98 ${
            highContrast
              ? 'bg-amber-400 text-black border-4 border-white'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/25'
          }`}
          style={{ minHeight: '85px' }}
        >
          <div className="flex items-center gap-4 text-left">
            <span className="text-4xl">🧠</span>
            <div>
              <div>PLAY COGNITIVE GAME</div>
              <span className="text-sm font-normal opacity-90">Adaptive Memory Recall & Suite</span>
            </div>
          </div>
          <span className="text-xl">➔</span>
        </button>

        {/* 2. MEDICINES */}
        <button
          onClick={() => setCurrentView('reminders')}
          className={`w-full py-6 px-8 rounded-3xl font-black text-2xl sm:text-3xl shadow-lg flex items-center justify-between transition-all transform active:scale-98 ${
            highContrast
              ? 'bg-slate-900 text-white border-2 border-slate-700'
              : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20'
          }`}
          style={{ minHeight: '80px' }}
        >
          <div className="flex items-center gap-4 text-left">
            <span className="text-4xl">💊</span>
            <div>
              <div>MEDICINES</div>
              <span className="text-sm font-normal opacity-90">Mark taken, skip, or review times</span>
            </div>
          </div>
          <span className="text-xl">➔</span>
        </button>

        {/* 3. WATER */}
        <button
          onClick={() => setCurrentView('reminders')}
          className={`w-full py-6 px-8 rounded-3xl font-black text-2xl sm:text-3xl shadow-lg flex items-center justify-between transition-all transform active:scale-98 ${
            highContrast
              ? 'bg-slate-900 text-white border-2 border-slate-700'
              : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-500/20'
          }`}
          style={{ minHeight: '80px' }}
        >
          <div className="flex items-center gap-4 text-left">
            <span className="text-4xl">💧</span>
            <div>
              <div>WATER (HYDRATION)</div>
              <span className="text-sm font-normal opacity-90">Track daily water glasses</span>
            </div>
          </div>
          <span className="text-xl">➔</span>
        </button>

        {/* 4. APPOINTMENTS */}
        <button
          onClick={() => setCurrentView('reminders')}
          className={`w-full py-6 px-8 rounded-3xl font-black text-2xl sm:text-3xl shadow-lg flex items-center justify-between transition-all transform active:scale-98 ${
            highContrast
              ? 'bg-slate-900 text-white border-2 border-slate-700'
              : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/20'
          }`}
          style={{ minHeight: '80px' }}
        >
          <div className="flex items-center gap-4 text-left">
            <span className="text-4xl">📅</span>
            <div>
              <div>APPOINTMENTS</div>
              <span className="text-sm font-normal opacity-90">Doctor visits & clinic checkups</span>
            </div>
          </div>
          <span className="text-xl">➔</span>
        </button>

        {/* 5. TALK (VOICE ASSISTANT) */}
        <button
          onClick={onOpenVoiceAssistant}
          className={`w-full py-6 px-8 rounded-3xl font-black text-2xl sm:text-3xl shadow-lg flex items-center justify-between transition-all transform active:scale-98 ${
            highContrast
              ? 'bg-amber-300 text-black'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
          }`}
          style={{ minHeight: '80px' }}
        >
          <div className="flex items-center gap-4 text-left">
            <span className="text-4xl">🎤</span>
            <div>
              <div>TALK TO MINDCARE</div>
              <span className="text-sm font-normal opacity-90">Speak to start game or check reminders</span>
            </div>
          </div>
          <span className="text-xl">➔</span>
        </button>
      </div>

      {/* Additional Links: View 5 Games or Progress */}
      <div className="w-full flex items-center justify-center gap-4">
        <button
          onClick={() => setCurrentView('games_hub')}
          className="px-6 py-3 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-bold text-base hover:bg-slate-300 transition"
        >
          Browse All 5 Cognitive Games
        </button>
        <button
          onClick={() => setCurrentView('progress')}
          className="px-6 py-3 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold text-base hover:bg-blue-200 transition"
        >
          View Progress & Analytics
        </button>
      </div>
    </div>
  );
}
