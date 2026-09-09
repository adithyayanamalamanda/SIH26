import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, RotateCcw, Award, Sun, Coffee, Pill, Footprints, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const ROUTINE_SETS = {
  1: [
    { id: 'wake', label: '1. Wake Up in the Morning', emoji: '🌅', correctOrder: 1 },
    { id: 'brush', label: '2. Brush Teeth & Wash Face', emoji: '🪥', correctOrder: 2 },
    { id: 'breakfast', label: '3. Eat Breakfast', emoji: '🥣', correctOrder: 3 },
    { id: 'medicine', label: '4. Take Morning Medicine', emoji: '💊', correctOrder: 4 }
  ],
  2: [
    { id: 'wake', label: 'Wake Up', emoji: '🌅', correctOrder: 1 },
    { id: 'brush', label: 'Brush Teeth', emoji: '🪥', correctOrder: 2 },
    { id: 'tea', label: 'Warm Cup of Morning Tea', emoji: '☕', correctOrder: 3 },
    { id: 'breakfast', label: 'Breakfast', emoji: '🥣', correctOrder: 4 },
    { id: 'medicine', label: 'Take Medicine', emoji: '💊', correctOrder: 5 }
  ],
  3: [
    { id: 'wake', label: 'Wake Up', emoji: '🌅', correctOrder: 1 },
    { id: 'brush', label: 'Brush Teeth', emoji: '🪥', correctOrder: 2 },
    { id: 'breakfast', label: 'Breakfast', emoji: '🥣', correctOrder: 3 },
    { id: 'medicine', label: 'Take Medicine', emoji: '💊', correctOrder: 4 },
    { id: 'walk', label: 'Morning Garden Walk', emoji: '🚶‍♂️', correctOrder: 5 },
    { id: 'water', label: 'Drink Water', emoji: '💧', correctOrder: 6 }
  ]
};

export default function DailyRoutineRecallGame({
  difficultyLevel = 1,
  onComplete,
  onBack,
  highContrast
}) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());

  const targetSet = ROUTINE_SETS[difficultyLevel] || ROUTINE_SETS[1];

  useEffect(() => {
    // Shuffle the routine cards so the elderly player orders them
    const shuffled = [...targetSet].sort(() => 0.5 - Math.random());
    setAvailableItems(shuffled);
    setSelectedItems([]);
    setIsSubmitted(false);
    setScore(0);
  }, [difficultyLevel]);

  const handlePickItem = (item) => {
    if (selectedItems.find((x) => x.id === item.id)) return;
    setSelectedItems((prev) => [...prev, item]);
    setAvailableItems((prev) => prev.filter((x) => x.id !== item.id));
  };

  const handleRemoveItem = (item) => {
    setSelectedItems((prev) => prev.filter((x) => x.id !== item.id));
    setAvailableItems((prev) => [...prev, item]);
  };

  const handleReset = () => {
    setAvailableItems([...targetSet].sort(() => 0.5 - Math.random()));
    setSelectedItems([]);
    setIsSubmitted(false);
  };

  const handleSubmit = () => {
    const elapsed = (Date.now() - startTime) / 1000;
    let correctMatches = 0;

    selectedItems.forEach((item, index) => {
      if (item.correctOrder === index + 1) {
        correctMatches += 1;
      }
    });

    const accuracy = Math.round((correctMatches / targetSet.length) * 100);
    const finalScore = Math.max(0, Math.min(100, Math.round(accuracy * 0.85 + Math.max(0, 15 - elapsed))));

    setScore(finalScore);
    setIsSubmitted(true);

    if (accuracy >= 75) {
      try { confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } }); } catch (e) {}
    }

    if (onComplete) {
      onComplete({
        gameType: 'daily_routine_recall',
        difficultyLevel,
        accuracy,
        responseTime: elapsed,
        attempts: selectedItems.length,
        hintsUsed: 0,
        performanceScore: finalScore,
        recommendedNextLevel: finalScore >= 80 ? Math.min(difficultyLevel + 1, 4) : difficultyLevel
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white font-bold transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <span className="px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-sm">
          Level {difficultyLevel} • {targetSet.length} Steps
        </span>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
          Daily Routine Order
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Arrange these everyday morning steps in the order you do them.
        </p>
      </div>

      {/* Ordered Timeline Container */}
      <div className="w-full max-w-2xl p-5 rounded-3xl bg-blue-50 dark:bg-slate-800/80 border-2 border-blue-200 dark:border-slate-700 mb-6">
        <p className="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider mb-3 text-center">
          Your Ordered Morning Steps:
        </p>

        {selectedItems.length === 0 ? (
          <div className="py-8 text-center text-slate-500 italic">
            Tap the cards below from first to last.
          </div>
        ) : (
          <div className="space-y-3">
            {selectedItems.map((item, idx) => {
              const isCorrectPosition = isSubmitted && item.correctOrder === idx + 1;
              const isWrongPosition = isSubmitted && item.correctOrder !== idx + 1;

              return (
                <div
                  key={item.id}
                  onClick={() => !isSubmitted && handleRemoveItem(item)}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    isCorrectPosition
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-200'
                      : isWrongPosition
                      ? 'bg-red-50 border-red-400 text-red-900'
                      : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-red-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-3xl select-none">{item.emoji}</span>
                    <span className="font-extrabold text-lg text-slate-900 dark:text-white">
                      {item.label}
                    </span>
                  </div>

                  {!isSubmitted && (
                    <span className="text-xs font-bold text-slate-400 hover:text-red-500">
                      Tap to Remove ✕
                    </span>
                  )}

                  {isSubmitted && isCorrectPosition && (
                    <span className="text-emerald-600 font-bold text-sm">✓ In Order</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Available Items to Pick */}
      {!isSubmitted && availableItems.length > 0 && (
        <div className="w-full max-w-2xl mb-8">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 text-center">
            Tap next step in your day:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handlePickItem(item)}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 shadow-sm flex items-center gap-4 text-left active:scale-95 transition-all"
              >
                <span className="text-4xl select-none">{item.emoji}</span>
                <span className="font-bold text-base text-slate-900 dark:text-white">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {!isSubmitted ? (
        <div className="flex gap-4 w-full max-w-md">
          <button
            onClick={handleReset}
            className="px-5 py-4 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white font-bold text-base"
          >
            Reset
          </button>
          <button
            onClick={handleSubmit}
            disabled={selectedItems.length < targetSet.length}
            className="flex-1 py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xl shadow-lg transition-all disabled:opacity-40"
          >
            Submit Routine
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-xl text-center">
          <Award className="w-14 h-14 text-amber-500 mx-auto mb-2" />
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
            Routine Exercise Done!
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Practicing everyday sequencing reinforces daily life independence and routine memory.
          </p>
          <button
            onClick={onBack}
            className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-lg shadow-lg"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
