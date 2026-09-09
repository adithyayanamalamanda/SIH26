import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, Sparkles, ArrowRight, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ResultScreen({
  resultData,
  allObjectsMap,
  onViewSummary,
  speakText,
  highContrast
}) {
  const {
    accuracy,
    correctAnswers,
    incorrectAnswers,
    missedAnswers,
    feedbackMessage,
    correctCount,
    performanceScore
  } = resultData;

  useEffect(() => {
    if (accuracy >= 75) {
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore if not loaded
      }
    }
    speakText(`Wonderful effort! You correctly found ${correctCount} items. ${feedbackMessage}`);
  }, [accuracy, correctCount, feedbackMessage, speakText]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col items-center">
      {/* Top Warm Feedback Banner */}
      <div className="w-full text-center mb-8">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-lg mb-3">
          <Sparkles className="w-6 h-6 text-emerald-600" />
          <span>Round Completed</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-3">
          {accuracy >= 80 ? 'Wonderful Recall!' : accuracy >= 60 ? 'Well Done!' : 'Great Practice Round!'}
        </h2>
        <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          {feedbackMessage}
        </p>
      </div>

      {/* Primary Highlights: Correct vs Missed Cards */}
      <div className="w-full space-y-6 mb-8">
        {/* Correct Answers Found */}
        <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-800">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            <h3 className="text-2xl font-bold text-emerald-950 dark:text-emerald-200">
              Correctly Remembered ({correctAnswers.length})
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {correctAnswers.map((id) => {
              const obj = allObjectsMap[id] || { label: id, emoji: '✨' };
              return (
                <div
                  key={id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-900 shadow-sm"
                >
                  <span className="text-4xl select-none">{obj.emoji}</span>
                  <div className="text-left">
                    <p className="font-bold text-base text-slate-900 dark:text-white">{obj.label}</p>
                    <span className="text-xs text-emerald-600 font-bold">✓ Correct</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Missed Objects (if any) */}
        {missedAnswers && missedAnswers.length > 0 && (
          <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-800">
            <h3 className="text-2xl font-bold text-amber-950 dark:text-amber-200 mb-4">
              Also Shown in Memory ({missedAnswers.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {missedAnswers.map((id) => {
                const obj = allObjectsMap[id] || { label: id, emoji: '🔍' };
                return (
                  <div
                    key={id}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-900 shadow-sm opacity-90"
                  >
                    <span className="text-4xl select-none">{obj.emoji}</span>
                    <div className="text-left">
                      <p className="font-bold text-base text-slate-900 dark:text-white">{obj.label}</p>
                      <span className="text-xs text-amber-600 font-semibold">Shown earlier</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Incorrect selections (if any) */}
        {incorrectAnswers && incorrectAnswers.length > 0 && (
          <div className="p-5 rounded-3xl bg-slate-100 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-3">
              Not in this round ({incorrectAnswers.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {incorrectAnswers.map((id) => {
                const obj = allObjectsMap[id] || { label: id, emoji: '❌' };
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-sm shadow-sm"
                  >
                    <span>{obj.emoji}</span>
                    <span>{obj.label}</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Primary Action Button */}
      <div className="w-full max-w-md">
        <button
          onClick={onViewSummary}
          className={`w-full py-6 px-8 rounded-3xl font-extrabold text-2xl sm:text-3xl shadow-xl transform active:scale-95 transition-all flex items-center justify-center space-x-3 ${
            highContrast
              ? 'bg-amber-400 hover:bg-amber-300 text-black border-4 border-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
          }`}
          style={{ minHeight: '80px' }}
        >
          <span>View Performance Summary</span>
          <ArrowRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
