import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ElderlyDashboard from './components/ElderlyDashboard';
import AdaptiveGameContainer from './components/AdaptiveMemoryGame/AdaptiveGameContainer';
import GamesHub from './components/games/GamesHub';
import MemoryMatchingGame from './components/games/MemoryMatchingGame';
import SequenceRecallGame from './components/games/SequenceRecallGame';
import PatternRecognitionGame from './components/games/PatternRecognitionGame';
import DailyRoutineRecallGame from './components/games/DailyRoutineRecallGame';
import RemindersView from './components/RemindersView';
import ProgressView from './components/ProgressView';
import CaregiverDashboard from './components/CaregiverDashboard';
import VoiceAssistantModal from './components/VoiceAssistantModal';
import DemoTourModal from './components/DemoTourModal';

import { initStorage, getPreferences, savePreferences } from './services/storage';

export default function App() {
  // Views: 'elderly_dashboard' | 'games_hub' | 'memory' | 'matching_game' | 'sequence_game' | 'pattern_game' | 'routine_game' | 'reminders' | 'progress' | 'caregiver_dashboard'
  const [currentView, setCurrentView] = useState('elderly_dashboard');
  const [language, setLanguage] = useState('en');
  const [highContrast, setHighContrast] = useState(false);
  const [textLarge, setTextLarge] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState(false);

  // Initialize storage and load preferences
  useEffect(() => {
    initStorage();
    const prefs = getPreferences();
    if (prefs.language) setLanguage(prefs.language);
    if (prefs.highContrast !== undefined) setHighContrast(prefs.highContrast);
    if (prefs.textLarge !== undefined) setTextLarge(prefs.textLarge);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    savePreferences({ language, highContrast, textLarge, isOffline });
  }, [language, highContrast, textLarge, isOffline]);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        highContrast ? 'high-contrast bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
      } ${textLarge ? 'text-size-large' : ''}`}
    >
      {/* Universal Navigation Header */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        language={language}
        setLanguage={setLanguage}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        textLarge={textLarge}
        setTextLarge={setTextLarge}
        isOffline={isOffline}
        setIsOffline={setIsOffline}
        onOpenDemoTour={() => setIsDemoTourOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {/* 1. Patient Welcome / Home Screen (Section 7) */}
        {currentView === 'elderly_dashboard' && (
          <ElderlyDashboard
            setCurrentView={setCurrentView}
            language={language}
            onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
            onStartMemoryGame={() => setCurrentView('memory')}
            highContrast={highContrast}
          />
        )}

        {/* 2. Cognitive Games Suite Hub (Section 8) */}
        {currentView === 'games_hub' && (
          <GamesHub
            onSelectGame={(gameId) => {
              if (gameId === 'memory_recall') setCurrentView('memory');
              else if (gameId === 'memory_matching') setCurrentView('matching_game');
              else if (gameId === 'sequence_recall') setCurrentView('sequence_game');
              else if (gameId === 'pattern_recognition') setCurrentView('pattern_game');
              else if (gameId === 'daily_routine') setCurrentView('routine_game');
            }}
            currentLevel={1}
            onBack={() => setCurrentView('elderly_dashboard')}
            highContrast={highContrast}
          />
        )}

        {/* Game 1: Adaptive Memory Recall (6 Screens) */}
        {currentView === 'memory' && (
          <AdaptiveGameContainer
            patientId="P001"
            highContrast={highContrast}
            textLarge={textLarge}
          />
        )}

        {/* Game 2: Memory Matching */}
        {currentView === 'matching_game' && (
          <MemoryMatchingGame
            difficultyLevel={1}
            onComplete={() => {}}
            onBack={() => setCurrentView('games_hub')}
            highContrast={highContrast}
          />
        )}

        {/* Game 3: Sequence Recall */}
        {currentView === 'sequence_game' && (
          <SequenceRecallGame
            difficultyLevel={1}
            onComplete={() => {}}
            onBack={() => setCurrentView('games_hub')}
            highContrast={highContrast}
          />
        )}

        {/* Game 4: Pattern Recognition */}
        {currentView === 'pattern_game' && (
          <PatternRecognitionGame
            difficultyLevel={1}
            onComplete={() => {}}
            onBack={() => setCurrentView('games_hub')}
            highContrast={highContrast}
          />
        )}

        {/* Game 5: Daily Routine Recall */}
        {currentView === 'routine_game' && (
          <DailyRoutineRecallGame
            difficultyLevel={1}
            onComplete={() => {}}
            onBack={() => setCurrentView('games_hub')}
            highContrast={highContrast}
          />
        )}

        {/* 3. Reminders System (Section 17: Medicine, Hydration, Activities, Appointments) */}
        {currentView === 'reminders' && (
          <RemindersView
            setCurrentView={setCurrentView}
            language={language}
          />
        )}

        {/* 4. Cognitive Progress Analytics (Section 12: Trend chart, score 0-100) */}
        {currentView === 'progress' && (
          <ProgressView
            setCurrentView={setCurrentView}
            language={language}
          />
        )}

        {/* 5. Caregiver Web Dashboard (Section 18, 19, 20: Patients, Trends, Alerts, Demo Drop) */}
        {currentView === 'caregiver_dashboard' && (
          <CaregiverDashboard
            setCurrentView={setCurrentView}
            language={language}
          />
        )}
      </main>

      {/* Voice Assistant Overlay Modal (Section 14) */}
      <VoiceAssistantModal
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
        setCurrentView={setCurrentView}
        language={language}
      />

      {/* SIH Presentation Tour Guide Modal (Section 35) */}
      <DemoTourModal
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
        setCurrentView={setCurrentView}
        setIsOffline={setIsOffline}
      />

      {/* Footer */}
      <footer className="py-3 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 bg-white/40 dark:bg-slate-900/40">
        MindCare NER Prototype • Ministry of Development of North Eastern Region (MDoNER) • SIH 2026 Problem 26003
      </footer>
    </div>
  );
}
