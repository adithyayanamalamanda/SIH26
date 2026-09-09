import React, { useState } from 'react';
import {
  Globe,
  Wifi,
  WifiOff,
  Sun,
  Moon,
  Type,
  Home,
  Users,
  ShieldCheck,
  Brain,
  Bell,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { translations } from '../services/translations';

export default function Header({
  currentView,
  setCurrentView,
  language,
  setLanguage,
  highContrast,
  setHighContrast,
  textLarge,
  setTextLarge,
  isOffline,
  setIsOffline,
  onOpenDemoTour
}) {
  const [showSyncToast, setShowSyncToast] = useState(false);
  const t = translations[language] || translations.en;

  const toggleOfflineMode = () => {
    if (isOffline) {
      setIsOffline(false);
      setShowSyncToast(true);
      setTimeout(() => setShowSyncToast(false), 3500);
    } else {
      setIsOffline(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
      {/* Synchronization Notification Toast */}
      {showSyncToast && (
        <div className="bg-emerald-600 text-white text-center py-2 px-4 font-bold text-sm flex items-center justify-center gap-2 animate-bounce">
          <ShieldCheck className="w-5 h-5" />
          <span>✓ Data Synchronized — Local gameplay & reminder activity uploaded to cloud</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Left: Brand & Mode Navigation */}
          <div className="flex items-center gap-4">
            <div
              onClick={() => setCurrentView('elderly_dashboard')}
              className="flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 text-2xl group-hover:scale-105 transition">
                🧠
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 dark:text-white">
                    MindCare NER
                  </span>
                  <span className="text-[10px] uppercase px-2 py-0.5 font-extrabold rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 tracking-wider">
                    SIH 2026 • 26003
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden md:block">
                  Cognitive Gaming & Memory Assistance Platform (NER)
                </p>
              </div>
            </div>

            {/* Quick Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1.5 ml-2">
              <button
                onClick={() => setCurrentView('elderly_dashboard')}
                className={`px-3 py-1.5 rounded-xl font-bold text-sm transition ${
                  currentView === 'elderly_dashboard'
                    ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Patient Home
              </button>
              <button
                onClick={() => setCurrentView('games_hub')}
                className={`px-3 py-1.5 rounded-xl font-bold text-sm transition ${
                  currentView === 'games_hub' || currentView === 'memory'
                    ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                5 Games
              </button>
              <button
                onClick={() => setCurrentView('reminders')}
                className={`px-3 py-1.5 rounded-xl font-bold text-sm transition ${
                  currentView === 'reminders'
                    ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Reminders
              </button>
              <button
                onClick={() => setCurrentView('progress')}
                className={`px-3 py-1.5 rounded-xl font-bold text-sm transition ${
                  currentView === 'progress'
                    ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Progress
              </button>
            </nav>
          </div>

          {/* Right Controls: Caregiver Portal + Offline Toggle + Language + Accessibility */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Caregiver Switch Button */}
            <button
              onClick={() =>
                setCurrentView(currentView === 'caregiver_dashboard' ? 'elderly_dashboard' : 'caregiver_dashboard')
              }
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition border ${
                currentView === 'caregiver_dashboard'
                  ? 'bg-purple-600 text-white border-purple-700 shadow-sm'
                  : 'bg-purple-50 hover:bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{currentView === 'caregiver_dashboard' ? 'Back to Patient' : 'Caregiver View'}</span>
            </button>

            {/* Offline Simulation Toggle */}
            <button
              onClick={toggleOfflineMode}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                isOffline
                  ? 'bg-amber-100 text-amber-900 border-amber-400'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300'
              }`}
              title="Toggle connectivity to test offline-first functionality"
            >
              {isOffline ? <WifiOff className="w-4 h-4 text-amber-600" /> : <Wifi className="w-4 h-4 text-emerald-600" />}
              <span className="hidden sm:inline">{isOffline ? 'Offline (Saved)' : 'Online (Sync)'}</span>
            </button>

            {/* Language Selector (English, Hindi, Assamese, Telugu) */}
            <div className="relative inline-flex items-center">
              <Globe className="w-4 h-4 absolute left-2 text-slate-400 pointer-events-none" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="pl-7 pr-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white cursor-pointer focus:outline-none"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="as">অসমীয়া (Assamese)</option>
                <option value="te">తెలుగు (Telugu)</option>
              </select>
            </div>

            {/* High Contrast */}
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`p-2 rounded-xl border transition ${
                highContrast
                  ? 'bg-amber-400 text-black border-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700'
              }`}
              title="High Contrast Mode"
            >
              {highContrast ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Large Text */}
            <button
              onClick={() => setTextLarge(!textLarge)}
              className={`p-2 rounded-xl border transition ${
                textLarge
                  ? 'bg-blue-600 text-white border-blue-700'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700'
              }`}
              title="Large Text Size"
            >
              <Type className="w-4 h-4" />
            </button>

            {/* SIH Demo Tour Button */}
            {onOpenDemoTour && (
              <button
                onClick={onOpenDemoTour}
                className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-xs shadow-sm flex items-center gap-1 hover:opacity-90 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>SIH Demo Guide</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
