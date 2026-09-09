import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Clock, Award, CheckCircle2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

const SEQUENCE_POOL = [
  { id: 'apple', label: 'Apple', emoji: '🍎' },
  { id: 'house', label: 'House', emoji: '🏠' },
  { id: 'flower', label: 'Flower', emoji: '🌸' },
  { id: 'car', label: 'Car', emoji: '🚗' },
  { id: 'tree', label: 'Tree', emoji: '🌳' },
  { id: 'bird', label: 'Bird', emoji: '🐦' },
  { id: 'bell', label: 'Bell', emoji: '🔔' },
  { id: 'cup', label: 'Tea Cup', emoji: '☕' }
];

export default function SequenceRecallGame({
  difficultyLevel = 1,
  onComplete,
  onBack,
  highContrast
}) {
  // Sequence length: Level 1: 3 items, Level 2: 4 items, Level 3: 5 items, Level 4: 6 items
  const seqLength = difficultyLevel === 1 ? 3 : difficultyLevel === 2 ? 4 : difficultyLevel === 3 ? 5 : 6;
  const displaySeconds = difficultyLevel === 1 ? 5 : difficultyLevel === 2 ? 5 : 4;

  const [phase, setPhase] = useState('memorize'); // 'memorize' | 'recall' | 'result'
  const [targetSequence, setTargetSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [timer, setTimer] = useState(displaySeconds);
  const [candidatePool, setCandidatePool] = useState([]);
  const [startTime, setStartTime] = useState(0);

  // Initialize round
  useEffect(() => {
    const shuffled = [...SEQUENCE_POOL].sort(() => 0.5 - Math.random());
    const target = shuffled.slice(0, seqLength);
    const pool = [...target, ...shuffled.slice(seqLength, seqLength + 2)].sort(() => 0.5 - Math.random());

    setTargetSequence(target);
    setCandidatePool(pool);
    setUserSequence([]);
    setPhase('memorize');
    setTimer(displaySeconds);
  }, [difficultyLevel, seqLength, displaySeconds]);

  // Countdown timer for memorization
  useEffect(() => {
    if (phase !== 'memorize') return;

    if (timer <= 0) {
      setPhase('recall');
      setStartTime(Date.now());
      return;
    }

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, timer]);

  const handleSelectObject = (obj) => {
    if (userSequence.length >= targetSequence.length) return;
    setUserSequence((prev) => [...prev, obj]);
  };

  const handleRemoveLast = () => {
    setUserSequence((prev) => prev.slice(0, prev.length - 1));
  };

  const handleSubmit = () => {
    const elapsed = (Date.now() - startTime) / 1000;
    let correctCount = 0;
    targetSequence.forEach((t, idx) => {
      if (userSequence[idx] && userSequence[idx].id === t.id) {
        correctCount += 1;
      }
    });

    const accuracy = Math.round((correctCount / targetSequence.length) * 100);
    const score = Math.max(0, Math.min(100, Math.round(accuracy * 0.8 + Math.max(0, 20 - elapsed))));

    setPhase('result');
    if (accuracy >= 75) {
      try { confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } }); } catch (e) {}
    }

    if (onComplete) {
      onComplete({
        gameType: 'sequence_recall',
        difficultyLevel,
        accuracy,
        responseTime: elapsed,
        attempts: userSequence.length,
        hintsUsed: 0,
        performanceScore: score,
        recommendedNextLevel: score >= 80 ? Math.min(difficultyLevel + 1, 4) : difficultyLevel
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col items-center">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white font-bold transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <span className="px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-bold text-sm">
          Level {difficultyLevel} • {seqLength} Steps
        </span>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
          Sequence Recall
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          {phase === 'memorize'
            ? `Remember the exact order of these ${seqLength} items!`
            : phase === 'recall'
            ? `Tap the objects in the exact order you saw them.`
            : `Here is your result!`}
        </p>
      </div>

      {/* Memorize Phase */}
      {phase === 'memorize' && (
        <div className="w-full max-w-2xl flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-black text-xl mb-6 border border-amber-300">
            <Clock className="w-6 h-6 animate-spin" />
            <span>Time Left: {timer}s</span>
          </div>

          <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap mb-8">
            {targetSequence.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center p-5 rounded-3xl bg-white dark:bg-slate-800 border-4 border-purple-300 dark:border-purple-700 shadow-md min-w-[100px]"
              >
                <span className="text-xs font-black text-purple-600 mb-1">STEP {idx + 1}</span>
                <span className="text-5xl select-none mb-1">{item.emoji}</span>
                <span className="font-bold text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recall Phase */}
      {phase === 'recall' && (
        <div className="w-full max-w-2xl flex flex-col items-center">
          {/* User's Current Sequence Slots */}
          <div className="w-full p-4 rounded-3xl bg-slate-100 dark:bg-slate-800/60 border-2 border-slate-300 dark:border-slate-700 mb-6">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
              Your Sequence Order:
            </p>
            <div className="flex items-center justify-center gap-3 min-h-[80px]">
              {Array.from({ length: seqLength }).map((_, idx) => {
                const picked = userSequence[idx];
                return (
                  <div
                    key={idx}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-dashed border-purple-400 bg-white dark:bg-slate-800 flex flex-col items-center justify-center shadow-inner"
                  >
                    {picked ? (
                      <>
                        <span className="text-2xl sm:text-3xl select-none">{picked.emoji}</span>
                        <span className="text-[10px] font-bold truncate max-w-[60px]">{picked.label}</span>
                      </>
                    ) : (
                      <span className="text-xs font-bold text-slate-400">{idx + 1}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Candidates Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mb-6">
            {candidatePool.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectObject(item)}
                disabled={userSequence.length >= seqLength}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-purple-500 shadow-sm flex flex-col items-center active:scale-95 transition-all disabled:opacity-50"
              >
                <span className="text-4xl select-none mb-1">{item.emoji}</span>
                <span className="font-bold text-sm text-slate-800 dark:text-white">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-3 w-full">
            <button
              onClick={handleRemoveLast}
              disabled={userSequence.length === 0}
              className="px-5 py-4 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white font-bold text-base disabled:opacity-40"
            >
              Undo Last
            </button>
            <button
              onClick={handleSubmit}
              disabled={userSequence.length < seqLength}
              className="flex-1 py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xl shadow-lg transition-all disabled:opacity-40"
            >
              Submit Sequence
            </button>
          </div>
        </div>
      )}

      {/* Result Phase */}
      {phase === 'result' && (
        <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-xl text-center">
          <Award className="w-14 h-14 text-purple-600 mx-auto mb-2" />
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
            Round Completed!
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Great memory exercise! Sequences help stimulate chronological recall in everyday life.
          </p>
          <button
            onClick={onBack}
            className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-lg shadow-lg"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
