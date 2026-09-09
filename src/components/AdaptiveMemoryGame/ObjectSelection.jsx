import React, { useState, useEffect, useRef } from 'react';
import { Check, HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ObjectSelection({
  selectionPool,
  targetCount,
  targetObjectIds,
  onSubmit,
  speakText,
  highContrast
}) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [hintedId, setHintedId] = useState(null);
  const [hintsCount, setHintsCount] = useState(0);
  const [attemptsCount, setAttemptsCount] = useState(0);

  const startTimeRef = useRef(Date.now());

  const toggleSelect = (id) => {
    setAttemptsCount((prev) => prev + 1);
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleUseHint = () => {
    // Find a target object that the user hasn't selected yet
    const unselectedTargets = targetObjectIds.filter((id) => !selectedIds.includes(id));
    if (unselectedTargets.length > 0) {
      const hintTarget = unselectedTargets[0];
      setHintedId(hintTarget);
      setHintsCount((prev) => prev + 1);
      const foundObj = selectionPool.find((o) => o.id === hintTarget);
      speakText(`Here is a gentle clue: look for the ${foundObj?.label || 'highlighted item'}.`);
    } else {
      speakText("You have already selected all the memory items you saw! You can tap Submit now.");
    }
  };

  const handleSubmit = () => {
    const elapsedSeconds = (Date.now() - startTimeRef.current) / 1000;
    onSubmit({
      selectedIds,
      responseTime: elapsedSeconds,
      attempts: Math.max(attemptsCount, selectedIds.length),
      hintsUsed: hintsCount
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col items-center">
      {/* Title & Instructions */}
      <div className="w-full max-w-2xl text-center mb-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
          Which Objects Did You See?
        </h2>
        <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300">
          Tap on each picture that was shown earlier.
        </p>

        {/* Counter badge */}
        <div className="mt-3 inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-200 font-bold text-lg border border-blue-200 dark:border-blue-800">
          <CheckCircle2 className="w-6 h-6 text-blue-600" />
          <span>
            Selected {selectedIds.length} of {targetCount} objects
          </span>
        </div>
      </div>

      {/* Grid of Candidate Objects */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5 mb-8">
        {selectionPool.map((obj) => {
          const isSelected = selectedIds.includes(obj.id);
          const isHinted = hintedId === obj.id;

          return (
            <button
              key={obj.id}
              onClick={() => toggleSelect(obj.id)}
              className={`relative flex flex-col items-center justify-center p-5 rounded-3xl border-4 text-center transition-all transform active:scale-95 shadow-md ${
                isSelected
                  ? highContrast
                    ? 'bg-amber-400 text-black border-white ring-4 ring-white'
                    : 'bg-blue-50 dark:bg-blue-950/80 border-blue-600 ring-4 ring-blue-400/40 text-blue-950 dark:text-white scale-102'
                  : isHinted
                  ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-950/40 animate-pulse text-slate-900 dark:text-white'
                  : highContrast
                  ? 'bg-slate-900 text-white border-slate-700 hover:border-slate-500'
                  : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 hover:border-slate-400'
              }`}
              style={{ minHeight: '160px' }}
            >
              {/* Checkmark indicator badge */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
              )}

              {/* Hint badge */}
              {isHinted && !isSelected && (
                <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-amber-400 text-black text-xs font-black">
                  HINT
                </div>
              )}

              <div className="text-5xl sm:text-6xl mb-2 filter drop-shadow-sm select-none">
                {obj.emoji}
              </div>
              <p className="text-lg sm:text-xl font-black leading-snug">
                {obj.label}
              </p>
              {obj.regional_label && (
                <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {obj.regional_label}
                </p>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Action Bar */}
      <div className="w-full max-w-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Gentle Hint Button */}
        <button
          onClick={handleUseHint}
          className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-950 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-200 font-bold text-lg flex items-center justify-center gap-2 border border-amber-300 dark:border-amber-700 transition-all"
        >
          <HelpCircle className="w-6 h-6 text-amber-600" />
          <span>Need a Hint? ({hintsCount} used)</span>
        </button>

        {/* Primary Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={selectedIds.length === 0}
          className={`w-full sm:w-auto flex-1 py-5 px-8 rounded-3xl font-extrabold text-2xl shadow-xl transform active:scale-95 transition-all flex items-center justify-center space-x-3 ${
            selectedIds.length === 0
              ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
              : highContrast
              ? 'bg-amber-400 hover:bg-amber-300 text-black border-4 border-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/25'
          }`}
          style={{ minHeight: '75px' }}
        >
          <span>Submit My Answer</span>
          <ArrowRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
