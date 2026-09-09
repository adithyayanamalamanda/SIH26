import React, { useState, useEffect, useRef } from 'react';
import {
  Target,
  Sparkles,
  Volume2,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Home,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { translations } from '../services/translations';
import { speakText } from '../services/speech';
import { getAIState, recordGameSession } from '../services/storage';
import { calculateAdaptiveDifficulty } from '../services/adaptiveAI';

export default function AttentionGame({ setCurrentView, language }) {
  const t = translations[language] || translations.en;
  const aiState = getAIState();
  const currentDifficulty = aiState.attentionDifficulty || 'Medium';

  // Total rounds
  const totalRounds = currentDifficulty === 'Easy' ? 3 : currentDifficulty === 'Hard' ? 5 : 4;

  const [currentRound, setCurrentRound] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [responseTimes, setResponseTimes] = useState([]);
  const [feedback, setFeedback] = useState(null); // { isCorrect: boolean, selectedId }
  const [isFinished, setIsFinished] = useState(false);
  const [aiAdjustment, setAiAdjustment] = useState(null);
  const [finalScore, setFinalScore] = useState(0);

  const roundStartTimeRef = useRef(Date.now());

  // Round definitions
  const rounds = [
    {
      type: 'color',
      instruction: t.attentionGame.instructionColor,
      targetCriteria: 'red',
      items: [
        { id: '1', emoji: '🍎', label: 'Red Apple', isTarget: true, color: 'red' },
        { id: '2', emoji: '🍏', label: 'Green Apple', isTarget: false, color: 'green' },
        { id: '3', emoji: '🍌', label: 'Yellow Banana', isTarget: false, color: 'yellow' },
        { id: '4', emoji: '🫐', label: 'Blueberries', isTarget: false, color: 'blue' },
      ]
    },
    {
      type: 'duplicate',
      instruction: t.attentionGame.instructionDuplicate,
      targetCriteria: 'duplicate',
      items: [
        { id: 'd1', emoji: '🔑', label: 'Key', isTarget: true },
        { id: 'd2', emoji: '📱', label: 'Phone', isTarget: false },
        { id: 'd3', emoji: '🔑', label: 'Key', isTarget: true },
        { id: 'd4', emoji: '☂️', label: 'Umbrella', isTarget: false },
        { id: 'd5', emoji: '🥛', label: 'Milk', isTarget: false },
        { id: 'd6', emoji: '📖', label: 'Book', isTarget: false },
      ]
    },
    {
      type: 'color',
      instruction: 'Tap the RED object as quickly as you can!',
      targetCriteria: 'red',
      items: [
        { id: 'r1', emoji: '🥦', label: 'Broccoli', isTarget: false, color: 'green' },
        { id: 'r2', emoji: '🍓', label: 'Red Strawberry', isTarget: true, color: 'red' },
        { id: 'r3', emoji: '🍊', label: 'Orange', isTarget: false, color: 'orange' },
        { id: 'r4', emoji: '🍋', label: 'Lemon', isTarget: false, color: 'yellow' },
      ]
    },
    {
      type: 'duplicate',
      instruction: t.attentionGame.instructionDuplicate,
      targetCriteria: 'duplicate',
      items: [
        { id: 'c1', emoji: '☕', label: 'Tea Cup', isTarget: true },
        { id: 'c2', emoji: '👓', label: 'Glasses', isTarget: false },
        { id: 'c3', emoji: '🌸', label: 'Flower', isTarget: false },
        { id: 'c4', emoji: '☕', label: 'Tea Cup', isTarget: true },
        { id: 'c5', emoji: '🍎', label: 'Apple', isTarget: false },
        { id: 'c6', emoji: '⏰', label: 'Clock', isTarget: false },
      ]
    },
    {
      type: 'color',
      instruction: 'Tap the RED object as quickly as you can!',
      targetCriteria: 'red',
      items: [
        { id: 'k1', emoji: '🎈', label: 'Red Balloon', isTarget: true, color: 'red' },
        { id: 'k2', emoji: '📘', label: 'Blue Book', isTarget: false, color: 'blue' },
        { id: 'k3', emoji: '🧤', label: 'Green Mitten', isTarget: false, color: 'green' },
        { id: 'k4', emoji: '🌻', label: 'Sunflower', isTarget: false, color: 'yellow' },
      ]
    }
  ].slice(0, totalRounds);

  const activeRound = rounds[currentRound];

  const initGame = () => {
    setCurrentRound(0);
    setCorrectCount(0);
    setResponseTimes([]);
    setFeedback(null);
    setIsFinished(false);
    setAiAdjustment(null);
    setFinalScore(0);
    roundStartTimeRef.current = Date.now();

    speakText(rounds[0].instruction, language);
  };

  useEffect(() => {
    initGame();
  }, [currentDifficulty]);

  const handleSelect = (item) => {
    if (feedback) return;

    const elapsed = (Date.now() - roundStartTimeRef.current) / 1000;
    setResponseTimes((prev) => [...prev, elapsed]);

    const isCorrect = item.isTarget;

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      setFeedback({ isCorrect: true, selectedId: item.id });
      speakText('Excellent! Well done!', language);
    } else {
      setFeedback({ isCorrect: false, selectedId: item.id });
      speakText("That's okay, take your time!", language);
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentRound + 1 < rounds.length) {
        setCurrentRound((prev) => prev + 1);
        roundStartTimeRef.current = Date.now();
        speakText(rounds[currentRound + 1].instruction, language);
      } else {
        finishGame(isCorrect ? correctCount + 1 : correctCount);
      }
    }, 1200);
  };

  const finishGame = (finalCorrect) => {
    const scorePct = Math.round((finalCorrect / totalRounds) * 100);
    setFinalScore(scorePct);

    const avgTime = responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 2.5;

    // Evaluate Adaptive AI
    const adjustment = calculateAdaptiveDifficulty('attention', scorePct, currentDifficulty, avgTime);
    setAiAdjustment(adjustment);

    // Save session
    recordGameSession({
      game: 'Attention Training',
      type: 'attention',
      score: scorePct,
      difficulty: currentDifficulty,
      responseTime: parseFloat(avgTime.toFixed(1)),
      details: `${finalCorrect}/${totalRounds} focus targets correctly found`
    });

    setIsFinished(true);

    if (scorePct >= 50) {
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }

    speakText(
      `${t.attentionGame.greatJob} Score: ${scorePct} percent. ${adjustment.reason}`,
      language
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('elderly_dashboard')}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Return to Dashboard"
          >
            <Home className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t.attentionGame.title}
            </h1>
            <p className="text-xs sm:text-sm text-sky-700 font-semibold">
              Current AI Level: {currentDifficulty}
            </p>
          </div>
        </div>

        <button
          onClick={() => speakText(activeRound ? activeRound.instruction : '', language)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-semibold text-sm transition"
        >
          <Volume2 className="w-5 h-5" />
          <span className="hidden sm:inline">{t.common.listenVoice}</span>
        </button>
      </div>

      {!isFinished && activeRound && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-sky-200 shadow-elderly">
          {/* Round Indicator */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <span className="text-sm sm:text-base font-bold text-slate-500">
              {t.attentionGame.round} {currentRound + 1} of {totalRounds}
            </span>
            <div className="flex gap-1.5">
              {rounds.map((_, i) => (
                <div
                  key={i}
                  className={`w-3.5 h-3.5 rounded-full ${
                    i < currentRound
                      ? 'bg-sky-600'
                      : i === currentRound
                      ? 'bg-sky-400 ring-2 ring-sky-500'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Instruction */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
              {activeRound.instruction}
            </h2>
            <p className="text-sm sm:text-base text-slate-500">
              Tap the correct picture below
            </p>
          </div>

          {/* Cards Grid */}
          <div className={`grid gap-4 sm:gap-6 max-w-2xl mx-auto mb-6 ${
            activeRound.items.length > 4 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2'
          }`}>
            {activeRound.items.map((item) => {
              const isSelected = feedback && feedback.selectedId === item.id;

              let btnClass = 'bg-slate-50 border-slate-300 hover:border-sky-500 hover:bg-sky-50/50';
              if (feedback) {
                if (isSelected && feedback.isCorrect) {
                  btnClass = 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-500 text-emerald-950';
                } else if (isSelected && !feedback.isCorrect) {
                  btnClass = 'bg-rose-100 border-rose-500 ring-2 ring-rose-500 text-rose-950';
                } else if (item.isTarget) {
                  btnClass = 'bg-emerald-50 border-emerald-400 text-emerald-900';
                }
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  disabled={feedback !== null}
                  className={`p-6 sm:p-8 rounded-3xl border-3 font-bold text-xl sm:text-2xl shadow-sm transition flex flex-col items-center justify-center gap-3 active:scale-95 ${btnClass}`}
                >
                  <span className="text-6xl sm:text-7xl select-none" role="img" aria-label={item.label}>
                    {item.emoji}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {feedback && (
            <div
              className={`p-4 rounded-2xl text-center font-bold text-lg flex items-center justify-center gap-2 max-w-md mx-auto ${
                feedback.isCorrect
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-rose-100 text-rose-900 border border-rose-300'
              }`}
            >
              {feedback.isCorrect ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <span>Great observation! 🎯</span>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-rose-600" />
                  <span>That's okay, keep your eyes peeled! ❤️</span>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Finished Screen */}
      {isFinished && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-sky-200 shadow-elderly text-center">
          <div className="w-20 h-20 rounded-3xl bg-sky-100 text-sky-800 flex items-center justify-center text-4xl mx-auto mb-4 shadow-inner">
            🎯
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">
            {t.attentionGame.greatJob}
          </h2>

          <div className="max-w-md mx-auto my-6 p-6 rounded-3xl bg-gradient-to-br from-sky-50 to-teal-50 border border-sky-200">
            <span className="text-base font-semibold text-slate-600 block mb-1">
              {t.memoryGame.scoreLabel}
            </span>
            <span className="text-5xl sm:text-6xl font-extrabold text-sky-700">
              {finalScore}%
            </span>
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-sky-200 text-sm font-semibold text-slate-700">
              <div>
                <span className="block text-slate-500 text-xs">Targets Identified</span>
                <span className="text-lg text-emerald-700 font-bold">{correctCount} / {totalRounds}</span>
              </div>
              <div>
                <span className="block text-slate-500 text-xs">Response Time</span>
                <span className="text-lg text-slate-800 font-bold">
                  {responseTimes.length > 0
                    ? (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(1)
                    : 2.5}s
                </span>
              </div>
            </div>
          </div>

          {/* AI Notice */}
          {aiAdjustment && (
            <div className="max-w-xl mx-auto mb-8 p-5 rounded-2xl bg-sky-950 text-white text-left shadow-md border border-sky-800">
              <div className="flex items-center gap-2 text-sky-300 font-bold text-sm mb-1.5">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span>AI Cognitive Calibration</span>
              </div>
              <p className="text-base font-medium text-white mb-2">
                {t.attentionGame.aiAdjustmentNotice}
              </p>
              <div className="bg-sky-900/80 rounded-xl p-3 text-xs sm:text-sm text-sky-100 flex flex-wrap justify-between gap-2">
                <span>Previous Level: <strong>{aiAdjustment.previousLevel}</strong></span>
                <span>Focus Score: <strong>{aiAdjustment.score}%</strong></span>
                <span>Next Level: <strong className="text-amber-300">{aiAdjustment.newLevel}</strong></span>
              </div>
              <p className="text-xs text-sky-300 mt-2 italic">
                {aiAdjustment.reason}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={initGame}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-lg shadow-md flex items-center justify-center gap-2 transition"
            >
              <RotateCcw className="w-5 h-5" />
              <span>{t.memoryGame.playAgain}</span>
            </button>
            <button
              onClick={() => setCurrentView('elderly_dashboard')}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-lg transition"
            >
              <span>{t.memoryGame.backToDash}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
