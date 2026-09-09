import React, { useState, useEffect, useRef } from 'react';
import {
  Brain,
  Sparkles,
  Volume2,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Home,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { translations } from '../services/translations';
import { speakText } from '../services/speech';
import { getAIState, recordGameSession } from '../services/storage';
import { calculateAdaptiveDifficulty } from '../services/adaptiveAI';

// Available object cards for memory game
const ALL_ITEMS = [
  { id: 'apple', label: 'Apple', emoji: '🍎' },
  { id: 'milk', label: 'Milk', emoji: '🥛' },
  { id: 'key', label: 'Key', emoji: '🔑' },
  { id: 'phone', label: 'Phone', emoji: '📱' },
  { id: 'umbrella', label: 'Umbrella', emoji: '☂️' },
  { id: 'book', label: 'Book', emoji: '📖' },
  { id: 'glasses', label: 'Glasses', emoji: '👓' },
  { id: 'clock', label: 'Clock', emoji: '⏰' },
  { id: 'flower', label: 'Flower', emoji: '🌸' },
  { id: 'cup', label: 'Tea Cup', emoji: '☕' }
];

export default function MemoryGame({ setCurrentView, language }) {
  const t = translations[language] || translations.en;
  const aiState = getAIState();
  const currentDifficulty = aiState.memoryDifficulty || 'Medium';

  // Determine item count based on current difficulty
  const itemCount = currentDifficulty === 'Easy' ? 4 : currentDifficulty === 'Hard' ? 8 : 6;
  const memorizeSeconds = currentDifficulty === 'Easy' ? 12 : currentDifficulty === 'Hard' ? 18 : 15;

  // Game Phases: 'memorize' -> 'testing' -> 'results'
  const [phase, setPhase] = useState('memorize');
  const [activeItems, setActiveItems] = useState([]);
  const [timer, setTimer] = useState(memorizeSeconds);
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [responseTimes, setResponseTimes] = useState([]);
  const [feedback, setFeedback] = useState(null); // { isCorrect: boolean, selectedId }
  const [aiAdjustment, setAiAdjustment] = useState(null);
  const [finalScore, setFinalScore] = useState(0);

  const questionStartTimeRef = useRef(Date.now());

  // Setup game round on mount or reset
  const initGame = () => {
    // Shuffle and pick items to memorize
    const shuffled = [...ALL_ITEMS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, itemCount);
    setActiveItems(selected);

    // Prepare questions: each question tests one item seen vs distractors not seen
    const unselected = shuffled.slice(itemCount);
    const numQuestions = Math.min(selected.length, currentDifficulty === 'Easy' ? 3 : 5);

    const generatedQuestions = [];
    for (let i = 0; i < numQuestions; i++) {
      const correctTarget = selected[i];
      // Pick 2 distractors from unselected pool
      const distractorPool = [...unselected].sort(() => 0.5 - Math.random()).slice(0, 2);
      const options = [correctTarget, ...distractorPool].sort(() => 0.5 - Math.random());

      generatedQuestions.push({
        correctTarget,
        options
      });
    }

    setQuestions(generatedQuestions);
    setPhase('memorize');
    setTimer(memorizeSeconds);
    setCurrentQIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setResponseTimes([]);
    setFeedback(null);
    setAiAdjustment(null);
    setFinalScore(0);

    // Initial voice instruction
    speakText(
      `${t.memoryGame.memorizeIntro} Look at these ${itemCount} pictures carefully.`,
      language
    );
  };

  useEffect(() => {
    initGame();
  }, [currentDifficulty]);

  // Memorization countdown timer
  useEffect(() => {
    if (phase !== 'memorize') return;

    if (timer <= 0) {
      startRecallPhase();
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, timer]);

  const startRecallPhase = () => {
    setPhase('testing');
    questionStartTimeRef.current = Date.now();
    speakText(
      `${t.memoryGame.questionTitle} ${t.memoryGame.whichWasSeen}`,
      language
    );
  };

  const handleAnswer = (option) => {
    if (feedback) return; // Prevent double taps during feedback display

    const elapsedSec = (Date.now() - questionStartTimeRef.current) / 1000;
    const currentQ = questions[currentQIndex];
    const isCorrect = option.id === currentQ.correctTarget.id;

    setResponseTimes((prev) => [...prev, elapsedSec]);

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      setFeedback({ isCorrect: true, selectedId: option.id });
      speakText('Correct! Wonderful!', language);
    } else {
      setWrongCount((prev) => prev + 1);
      setFeedback({ isCorrect: false, selectedId: option.id });
      speakText("That's okay, keep trying!", language);
    }

    // Delay to let the user observe their choice feedback calmly
    setTimeout(() => {
      setFeedback(null);
      if (currentQIndex + 1 < questions.length) {
        setCurrentQIndex((prev) => prev + 1);
        questionStartTimeRef.current = Date.now();
      } else {
        finishGame(isCorrect ? correctCount + 1 : correctCount);
      }
    }, 1300);
  };

  const finishGame = (finalCorrect) => {
    const totalQ = questions.length;
    const scorePct = Math.round((finalCorrect / totalQ) * 100);
    setFinalScore(scorePct);

    // Calculate average response time
    const avgTime = responseTimes.length > 0
      ? (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
      : 3.5;

    // Trigger Adaptive AI Engine
    const adjustment = calculateAdaptiveDifficulty('memory', scorePct, currentDifficulty, avgTime);
    setAiAdjustment(adjustment);

    // Record session into persistent history
    recordGameSession({
      game: 'Memory Training',
      type: 'memory',
      score: scorePct,
      difficulty: currentDifficulty,
      responseTime: parseFloat(avgTime.toFixed(1)),
      details: `${finalCorrect}/${totalQ} items correctly recalled`
    });

    setPhase('results');

    // Confetti celebration if score >= 50%
    if (scorePct >= 50) {
      try {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }

    speakText(
      `${t.memoryGame.completedTitle} Your score is ${scorePct} percent. ${adjustment.reason}`,
      language
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      {/* Top Breadcrumb & Audio Helper */}
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
              {t.memoryGame.title}
            </h1>
            <p className="text-xs sm:text-sm text-teal-700 font-semibold">
              Current AI Level: {currentDifficulty} ({itemCount} Objects)
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (phase === 'memorize') {
              speakText(`${t.memoryGame.memorizeIntro} There are ${itemCount} pictures.`, language);
            } else if (phase === 'testing') {
              speakText(`${t.memoryGame.questionTitle} ${t.memoryGame.whichWasSeen}`, language);
            }
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold text-sm transition"
        >
          <Volume2 className="w-5 h-5" />
          <span className="hidden sm:inline">{t.common.listenVoice}</span>
        </button>
      </div>

      {/* PHASE 1: MEMORIZATION STAGE */}
      {phase === 'memorize' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-teal-200 shadow-elderly text-center">
          <div className="max-w-xl mx-auto mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
              {t.memoryGame.memorizeIntro}
            </h2>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 font-bold text-lg">
              <Clock className="w-5 h-5 text-teal-600 animate-pulse" />
              <span>{t.memoryGame.memorizeTimer}: {timer}s</span>
            </div>
          </div>

          {/* Cards Grid with clear emojis and large typography */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 mb-8 max-w-2xl mx-auto">
            {activeItems.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 hover:bg-teal-50/50 rounded-2xl p-5 border-2 border-slate-200 flex flex-col items-center justify-center shadow-sm transition hover:scale-105"
              >
                <span className="text-5xl sm:text-6xl mb-2 select-none" role="img" aria-label={item.label}>
                  {item.emoji}
                </span>
                <span className="font-bold text-base sm:text-lg text-slate-800">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={startRecallPhase}
            className="px-8 py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-lg sm:text-xl shadow-md active:scale-95 transition flex items-center justify-center gap-3 mx-auto"
          >
            <span>{t.memoryGame.readyButton}</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* PHASE 2: RECALL & QUESTION STAGE */}
      {phase === 'testing' && questions.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-teal-200 shadow-elderly">
          {/* Question progress */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <span className="text-sm sm:text-base font-bold text-slate-500">
              Question {currentQIndex + 1} of {questions.length}
            </span>
            <div className="flex gap-1.5">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`w-3.5 h-3.5 rounded-full ${
                    i < currentQIndex
                      ? 'bg-teal-600'
                      : i === currentQIndex
                      ? 'bg-teal-300 ring-2 ring-teal-500'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
              {t.memoryGame.questionTitle}
            </h2>
            <p className="text-lg text-slate-600 font-medium">
              {t.memoryGame.whichWasSeen}
            </p>
          </div>

          {/* Multiple Choice Options (Extra Large Elderly-friendly buttons) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto mb-6">
            {questions[currentQIndex].options.map((option) => {
              const isSelected = feedback && feedback.selectedId === option.id;
              const isCorrectTarget = option.id === questions[currentQIndex].correctTarget.id;

              let btnStyle = 'bg-slate-50 border-slate-300 hover:border-teal-500 hover:bg-teal-50/50';
              if (feedback) {
                if (isSelected && feedback.isCorrect) {
                  btnStyle = 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-500 text-emerald-950';
                } else if (isSelected && !feedback.isCorrect) {
                  btnStyle = 'bg-rose-100 border-rose-500 ring-2 ring-rose-500 text-rose-950';
                } else if (isCorrectTarget) {
                  btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900';
                }
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option)}
                  disabled={feedback !== null}
                  className={`p-6 rounded-3xl border-3 font-bold text-xl sm:text-2xl shadow-sm transition flex flex-col items-center justify-center gap-3 active:scale-95 ${btnStyle}`}
                >
                  <span className="text-6xl select-none" role="img" aria-label={option.label}>
                    {option.emoji}
                  </span>
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback banner */}
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
                  <span>{t.memoryGame.correctFeedback}</span>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-rose-600" />
                  <span>{t.memoryGame.wrongFeedback}</span>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* PHASE 3: RESULTS & ADAPTIVE AI REPORT */}
      {phase === 'results' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-teal-200 shadow-elderly text-center">
          <div className="w-20 h-20 rounded-3xl bg-teal-100 text-teal-800 flex items-center justify-center text-4xl mx-auto mb-4 shadow-inner">
            🌟
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">
            {t.memoryGame.completedTitle}
          </h2>

          <div className="max-w-md mx-auto my-6 p-6 rounded-3xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200">
            <span className="text-base font-semibold text-slate-600 block mb-1">
              {t.memoryGame.scoreLabel}
            </span>
            <span className="text-5xl sm:text-6xl font-extrabold text-teal-700">
              {finalScore}%
            </span>
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-teal-200 text-sm font-semibold text-slate-700">
              <div>
                <span className="block text-slate-500 text-xs">Correct Answers</span>
                <span className="text-lg text-emerald-700 font-bold">{correctCount} / {questions.length}</span>
              </div>
              <div>
                <span className="block text-slate-500 text-xs">Avg Response</span>
                <span className="text-lg text-slate-800 font-bold">
                  {responseTimes.length > 0
                    ? (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(1)
                    : 3.5}s
                </span>
              </div>
            </div>
          </div>

          {/* Transparent Adaptive AI Notice */}
          {aiAdjustment && (
            <div className="max-w-xl mx-auto mb-8 p-5 rounded-2xl bg-teal-900 text-white text-left shadow-md border border-teal-700">
              <div className="flex items-center gap-2 text-teal-300 font-bold text-sm mb-1.5">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>AI Adaptive Engine Feedback</span>
              </div>
              <p className="text-base font-medium text-white mb-2">
                {t.memoryGame.aiAdjustmentNotice}
              </p>
              <div className="bg-teal-800/80 rounded-xl p-3 text-xs sm:text-sm text-teal-100 flex flex-wrap justify-between gap-2">
                <span>Previous level: <strong>{aiAdjustment.previousLevel}</strong></span>
                <span>Session Score: <strong>{aiAdjustment.score}%</strong></span>
                <span>Next level: <strong className="text-amber-300">{aiAdjustment.newLevel}</strong></span>
              </div>
              <p className="text-xs text-teal-300 mt-2 italic">
                {aiAdjustment.reason}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={initGame}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-lg shadow-md flex items-center justify-center gap-2 transition"
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
