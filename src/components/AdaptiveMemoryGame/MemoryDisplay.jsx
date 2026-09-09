import React, { useEffect, useState } from 'react';
import { Eye, Clock } from 'lucide-react';

export default function MemoryDisplay({
  targetObjects,
  viewingSeconds,
  onCountdownComplete,
  highContrast
}) {
  const [secondsRemaining, setSecondsRemaining] = useState(viewingSeconds);

  useEffect(() => {
    setSecondsRemaining(viewingSeconds);
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onCountdownComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [viewingSeconds, onCountdownComplete]);

  const progressPct = ((viewingSeconds - secondsRemaining) / viewingSeconds) * 100;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col items-center">
      {/* Top Countdown & Encouragement Banner */}
      <div className="w-full max-w-2xl mb-8 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 mb-4 border border-amber-300 dark:border-amber-700 shadow-sm">
          <Clock className="w-8 h-8 animate-pulse text-amber-600 dark:text-amber-400" />
          <span className="text-2xl sm:text-3xl font-black">
            Time Left: {secondsRemaining} Second{secondsRemaining === 1 ? '' : 's'}
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-4 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-red-500 transition-all duration-1000 ease-linear rounded-full"
            style={{ width: `${100 - progressPct}%` }}
          />
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-3">
          <Eye className="w-8 h-8 text-blue-600" />
          <span>Remember These Objects</span>
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-300 mt-1">
          Look at the pictures carefully before they disappear!
        </p>
      </div>

      {/* Grid of Target Objects */}
      <div className={`w-full grid gap-4 sm:gap-6 ${
        targetObjects.length <= 4
          ? 'grid-cols-2 sm:grid-cols-4 max-w-4xl'
          : targetObjects.length <= 6
          ? 'grid-cols-2 sm:grid-cols-3 max-w-4xl'
          : 'grid-cols-2 sm:grid-cols-4 max-w-5xl'
      }`}>
        {targetObjects.map((obj, idx) => (
          <div
            key={obj.id || idx}
            className={`flex flex-col items-center justify-center p-6 rounded-3xl border-4 shadow-lg transition-transform transform hover:scale-105 ${
              highContrast
                ? 'bg-black text-white border-amber-400'
                : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-blue-200 dark:border-slate-700 shadow-blue-500/10'
            }`}
            style={{ minHeight: '180px' }}
          >
            <div className="text-6xl sm:text-7xl mb-3 filter drop-shadow-md select-none">
              {obj.emoji}
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-center mb-1 leading-snug">
              {obj.label}
            </h3>
            {obj.regional_label && (
              <p className="text-sm sm:text-base font-semibold text-blue-700 dark:text-blue-300 text-center">
                {obj.regional_label}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Gentle Reassurance */}
      <div className="mt-8 text-center text-slate-500 dark:text-slate-400 text-lg font-medium">
        Take a deep breath and observe each item.
      </div>
    </div>
  );
}
