import React from 'react';
import { ArrowRight, Volume2, Sparkles, Brain, Heart, Shield, Cpu } from 'lucide-react';
import { translations } from '../services/translations';
import { speakText } from '../services/speech';

export default function LandingPage({ setCurrentView, language, onOpenDemoTour }) {
  const t = translations[language] || translations.en;

  const handleSpeakWelcome = () => {
    speakText(
      `${t.appName}. ${t.tagline}. Please choose Elderly User or Caregiver to begin.`,
      language
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center justify-center min-h-[82vh]">
      {/* Brand & Introduction */}
      <div className="text-center max-w-3xl mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-sm font-semibold mb-4 shadow-sm">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span>Smart India Hackathon 2026 • Problem Statement 26003</span>
        </div>

        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="text-5xl sm:text-6xl">🧠</span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">
            {t.appName}
          </h1>
          <button
            onClick={handleSpeakWelcome}
            className="p-3 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-700 transition"
            title="Read aloud"
            aria-label="Read introduction aloud"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>

        <p className="text-xl sm:text-2xl font-medium text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {t.tagline}
        </p>

        <p className="text-sm text-slate-400 mt-2">
          {t.common.disclaimer}
        </p>
      </div>

      {/* Two Large Portal Cards for Elderly & Caregiver */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-10">
        {/* Elderly User Portal */}
        <div
          onClick={() => setCurrentView('elderly_dashboard')}
          className="group relative bg-white hover:bg-teal-50/40 rounded-3xl p-8 sm:p-10 border-2 border-teal-200 hover:border-teal-500 shadow-elderly hover:shadow-elderly-lg transition-all duration-300 cursor-pointer flex flex-col items-center text-center transform hover:-translate-y-1"
        >
          <div className="w-24 h-24 rounded-3xl bg-teal-100 group-hover:bg-teal-200 text-teal-800 flex items-center justify-center text-5xl mb-6 shadow-inner transition">
            👴
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 group-hover:text-teal-800 transition">
            {t.roles.elderly}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed">
            {t.roles.elderlyDesc}
          </p>

          <button className="w-full py-4 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-lg sm:text-xl shadow-md flex items-center justify-center gap-3 transition">
            <span>Enter Elderly Mode</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition" />
          </button>
        </div>

        {/* Caregiver Portal */}
        <div
          onClick={() => setCurrentView('caregiver_dashboard')}
          className="group relative bg-white hover:bg-slate-50 rounded-3xl p-8 sm:p-10 border-2 border-slate-200 hover:border-slate-500 shadow-elderly hover:shadow-elderly-lg transition-all duration-300 cursor-pointer flex flex-col items-center text-center transform hover:-translate-y-1"
        >
          <div className="w-24 h-24 rounded-3xl bg-slate-100 group-hover:bg-slate-200 text-slate-800 flex items-center justify-center text-5xl mb-6 shadow-inner transition">
            👨‍👩‍👧
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 group-hover:text-slate-800 transition">
            {t.roles.caregiver}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed">
            {t.roles.caregiverDesc}
          </p>

          <button className="w-full py-4 px-6 rounded-2xl bg-slate-800 hover:bg-slate-900 active:bg-slate-950 text-white font-bold text-lg sm:text-xl shadow-md flex items-center justify-center gap-3 transition">
            <span>Open Caregiver Portal</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition" />
          </button>
        </div>
      </div>

      {/* Trust & Prototype Features Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl text-center">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col items-center">
          <Brain className="w-6 h-6 text-teal-600 mb-1" />
          <span className="font-bold text-sm text-slate-800">Adaptive AI</span>
          <span className="text-xs text-slate-500">Auto-difficulty scaling</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col items-center">
          <Volume2 className="w-6 h-6 text-blue-600 mb-1" />
          <span className="font-bold text-sm text-slate-800">Voice Guided</span>
          <span className="text-xs text-slate-500">Web Speech recognition</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col items-center">
          <Shield className="w-6 h-6 text-emerald-600 mb-1" />
          <span className="font-bold text-sm text-slate-800">100% Offline</span>
          <span className="text-xs text-slate-500">Local data persistence</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col items-center">
          <Heart className="w-6 h-6 text-rose-500 mb-1" />
          <span className="font-bold text-sm text-slate-800">Smart Alerts</span>
          <span className="text-xs text-slate-500">Caregiver wellness checks</span>
        </div>
      </div>
    </div>
  );
}
