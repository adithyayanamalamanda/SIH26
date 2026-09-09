import React, { useState, useEffect, useCallback, useMemo } from 'react';
import WelcomeHome from './WelcomeHome';
import GameInstructions from './GameInstructions';
import MemoryDisplay from './MemoryDisplay';
import ObjectSelection from './ObjectSelection';
import ResultScreen from './ResultScreen';
import PerformanceSummary from './PerformanceSummary';

import {
  apiStartGame,
  apiSubmitGame,
  apiGetHistory,
  apiTranscribeTextCommand,
  checkBackendHealth
} from '../../services/apiClient';

export default function AdaptiveGameContainer({
  patientId = 'P001',
  highContrast = false,
  textLarge = false
}) {
  // Screen routing state: 'welcome' | 'instructions' | 'display' | 'selection' | 'result' | 'summary'
  const [screen, setScreen] = useState('welcome');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameSession, setGameSession] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [patientHistory, setPatientHistory] = useState(null);
  const [backendOnline, setBackendOnline] = useState(false);

  // Voice assistant state
  const [isListening, setIsListening] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState('');

  // Text-to-speech helper
  const speakText = useCallback((text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85; // Slightly slower, calm cadence for elderly users
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Fetch initial patient profile & history
  const loadHistory = useCallback(async () => {
    const health = await checkBackendHealth();
    setBackendOnline(!!health);

    const history = await apiGetHistory(patientId);
    if (history) {
      setPatientHistory(history);
      if (history.currentLevel) {
        setCurrentLevel(history.currentLevel);
      }
    }
  }, [patientId]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Object lookup dictionary for results
  const allObjectsMap = useMemo(() => {
    if (!gameSession) return {};
    const map = {};
    (gameSession.targetObjects || []).forEach((o) => { map[o.id] = o; });
    (gameSession.selectionPool || []).forEach((o) => { map[o.id] = o; });
    return map;
  }, [gameSession]);

  // --- Game Flow Transitions ---

  // 1. User starts game from Home -> show Instructions
  const handleStartFromHome = async () => {
    const session = await apiStartGame(patientId, currentLevel);
    setGameSession(session);
    setScreen('instructions');
  };

  // 2. User confirms Instructions -> show Memory Display (countdown)
  const handleProceedToDisplay = () => {
    setScreen('display');
  };

  // 3. Countdown completes -> show Object Selection
  const handleCountdownComplete = () => {
    speakText("Now tap the pictures you remember seeing!");
    setScreen('selection');
  };

  // 4. User submits selection -> call backend API -> show Result Screen
  const handleSubmitSelection = async ({ selectedIds, responseTime, attempts, hintsUsed }) => {
    if (!gameSession) return;

    const payload = {
      sessionId: gameSession.sessionId,
      patientId: gameSession.patientId,
      difficultyLevel: gameSession.difficultyLevel,
      selectedObjectIds: selectedIds,
      targetObjectIds: gameSession.targetObjects.map((o) => o.id),
      responseTime,
      attempts,
      hintsUsed
    };

    const evalResult = await apiSubmitGame(payload);
    setResultData(evalResult);

    // Refresh history
    loadHistory();

    setScreen('result');
  };

  // 5. From Result -> show Performance Summary
  const handleViewSummary = () => {
    setScreen('summary');
  };

  // 6. From Summary -> Play Next Challenge (adaptive level)
  const handlePlayNext = async () => {
    const nextLvl = resultData?.nextDifficultyLevel || currentLevel;
    setCurrentLevel(nextLvl);
    const session = await apiStartGame(patientId, nextLvl);
    setGameSession(session);
    setScreen('instructions');
  };

  // Back to Home
  const handleGoHome = () => {
    setScreen('welcome');
    loadHistory();
  };

  // Voice Command Trigger
  const handleTriggerVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      // Simulate voice input for environments without mic permission
      simulateVoiceCommand('start game');
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;

      setIsListening(true);
      setVoiceFeedback('Listening to your voice command...');

      recognition.onresult = async (event) => {
        setIsListening(false);
        const transcript = event.results[0][0].transcript;
        setVoiceFeedback(`Heard: "${transcript}"`);

        // Send to Whisper command parser backend
        const res = await apiTranscribeTextCommand(transcript);
        executeVoiceCommand(res.detectedCommand, transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceFeedback('Microphone unavailable. Tap buttons to interact.');
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
      simulateVoiceCommand('start game');
    }
  };

  const simulateVoiceCommand = async (text) => {
    setVoiceFeedback(`Simulated voice: "${text}"`);
    const res = await apiTranscribeTextCommand(text);
    executeVoiceCommand(res.detectedCommand, text);
  };

  const executeVoiceCommand = (cmd, rawText) => {
    if (cmd === 'start_game') {
      speakText("Voice command recognized. Starting memory game!");
      handleStartFromHome();
    } else if (cmd === 'home') {
      speakText("Returning to home screen.");
      handleGoHome();
    } else {
      setVoiceFeedback(`Voice input "${rawText}" received.`);
    }
  };

  return (
    <div className={`w-full min-h-[85vh] flex flex-col justify-center py-4 ${textLarge ? 'text-xl' : ''}`}>
      {/* Screen 1: Welcome/Home */}
      {screen === 'welcome' && (
        <WelcomeHome
          patientId={patientId}
          currentLevel={currentLevel}
          onStartGame={handleStartFromHome}
          onSelectLevel={(lvl) => setCurrentLevel(lvl)}
          isListening={isListening}
          onTriggerVoice={handleTriggerVoice}
          voiceFeedback={voiceFeedback}
          speakText={speakText}
          highContrast={highContrast}
        />
      )}

      {/* Screen 2: Game Instructions */}
      {screen === 'instructions' && gameSession && (
        <GameInstructions
          level={gameSession.difficultyLevel}
          targetCount={gameSession.totalTargetCount}
          viewingSeconds={gameSession.viewingSeconds}
          onProceed={handleProceedToDisplay}
          onGoBack={handleGoHome}
          speakText={speakText}
          highContrast={highContrast}
        />
      )}

      {/* Screen 3: Memory Display */}
      {screen === 'display' && gameSession && (
        <MemoryDisplay
          targetObjects={gameSession.targetObjects}
          viewingSeconds={gameSession.viewingSeconds}
          onCountdownComplete={handleCountdownComplete}
          highContrast={highContrast}
        />
      )}

      {/* Screen 4: Object Selection */}
      {screen === 'selection' && gameSession && (
        <ObjectSelection
          selectionPool={gameSession.selectionPool}
          targetCount={gameSession.totalTargetCount}
          targetObjectIds={gameSession.targetObjects.map((o) => o.id)}
          onSubmit={handleSubmitSelection}
          speakText={speakText}
          highContrast={highContrast}
        />
      )}

      {/* Screen 5: Result Screen */}
      {screen === 'result' && resultData && (
        <ResultScreen
          resultData={resultData}
          allObjectsMap={allObjectsMap}
          onViewSummary={handleViewSummary}
          speakText={speakText}
          highContrast={highContrast}
        />
      )}

      {/* Screen 6: Performance Summary */}
      {screen === 'summary' && resultData && (
        <PerformanceSummary
          resultData={resultData}
          patientHistory={patientHistory}
          onPlayNext={handlePlayNext}
          onGoHome={handleGoHome}
          highContrast={highContrast}
        />
      )}
    </div>
  );
}
