import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Award, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const PATTERNS_BY_LEVEL = {
  1: [
    { sequence: ['☕', '🧣', '☕', '🧣'], answer: '☕', options: ['☕', '🧣', '🔔', '🍎'], explanation: 'Alternating tea cup and shawl' },
    { sequence: ['🔴', '🔵', '🔴', '🔵'], answer: '🔴', options: ['🔴', '🔵', '🟢', '🟡'], explanation: 'Alternating red and blue circles' },
    { sequence: ['🪔', '🔔', '🪔', '🔔'], answer: '🪔', options: ['🪔', '🔔', '🏺', '👒'], explanation: 'Alternating diya and bell' }
  ],
  2: [
    { sequence: ['🍃', '🍃', '🌼', '🍃', '🍃'], answer: '🌼', options: ['🍃', '🌼', '🪵', '☕'], explanation: 'Two leaves followed by one flower' },
    { sequence: ['▲', '▲', '■', '▲', '▲'], answer: '■', options: ['■', '▲', '●', '★'], explanation: 'Two triangles followed by one square' },
    { sequence: ['🥁', '🪈', '🥁', '🪈'], answer: '🥁', options: ['🥁', '🪈', '👒', '🧺'], explanation: 'Alternating dhol drum and flute' }
  ],
  3: [
    { sequence: ['🍎', '🥛', '🍞', '🍎', '🥛'], answer: '🍞', options: ['🍞', '🍎', '🥛', '☕'], explanation: 'Three-item cycle: Apple, Milk, Bread' },
    { sequence: ['🔴', '🔵', '🟢', '🔴', '🔵'], answer: '🟢', options: ['🟢', '🔴', '🔵', '🟡'], explanation: 'Three-color repeating cycle' }
  ],
  4: [
    { sequence: ['👒', '🧺', '🪭', '👒', '🧺'], answer: '🪭', options: ['🪭', '👒', '🧺', '🪵'], explanation: 'Traditional bamboo craft cycle' },
    { sequence: ['⭐', '⭐', '🌙', '⭐', '⭐'], answer: '🌙', options: ['🌙', '⭐', '☀️', '☁️'], explanation: 'Two stars followed by one moon' }
  ]
};

export default function PatternRecognitionGame({
  difficultyLevel = 1,
  onComplete,
  onBack,
  highContrast
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const list = PATTERNS_BY_LEVEL[difficultyLevel] || PATTERNS_BY_LEVEL[1];
    setQuestions(list);
    setCurrentIdx(0);
    setCorrectCount(0);
    setIsDone(false);
    setSelectedOption(null);
  }, [difficultyLevel]);

  const currentQ = questions[currentIdx] || questions[0];

  const handleChoose = (opt) => {
    if (selectedOption !== null) return; // prevent double taps
    setSelectedOption(opt);

    const isCorrect = opt === currentQ.answer;
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
    }

    setTimeout(() => {
      if (currentIdx + 1 < questions.length) {
        setCurrentIdx((i) => i + 1);
        setSelectedOption(null);
      } else {
        // Round finish
        const elapsed = (Date.now() - startTime) / 1000;
        const total = questions.length;
        const accuracy = Math.round(((correctCount + (isCorrect ? 1 : 0)) / total) * 100);
        const score = Math.max(0, Math.min(100, Math.round(accuracy * 0.85 + Math.max(0, 15 - elapsed))));

        setIsDone(true);
        if (accuracy >= 70) {
          try { confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } }); } catch (e) {}
        }

        if (onComplete) {
          onComplete({
            gameType: 'pattern_recognition',
            difficultyLevel,
            accuracy,
            responseTime: elapsed,
            attempts: total,
            hintsUsed: 0,
            performanceScore: score,
            recommendedNextLevel: score >= 80 ? Math.min(difficultyLevel + 1, 4) : difficultyLevel
          });
        }
      }
    }, 1200);
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
        <span className="px-3 py-1.5 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold text-sm">
          Level {difficultyLevel} • Pattern {currentIdx + 1} of {questions.length}
        </span>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
          What Comes Next?
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Observe the repeating sequence and select the picture that completes it.
        </p>
      </div>

      {!isDone && currentQ && (
        <div className="w-full max-w-2xl flex flex-col items-center">
          {/* Pattern Strip */}
          <div className="w-full p-6 rounded-3xl bg-white dark:bg-slate-800 border-4 border-teal-200 dark:border-slate-700 shadow-md flex items-center justify-center gap-3 sm:gap-4 flex-wrap mb-8">
            {currentQ.sequence.map((item, idx) => (
              <div
                key={idx}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-teal-50 dark:bg-slate-700 border-2 border-teal-300 dark:border-teal-800 flex items-center justify-center text-4xl sm:text-5xl shadow-sm"
              >
                {item}
              </div>
            ))}

            {/* Question placeholder */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-100 dark:bg-amber-950 border-3 border-dashed border-amber-500 flex items-center justify-center text-3xl font-black text-amber-700 animate-pulse shadow-inner">
              ❓
            </div>
          </div>

          {/* Answer Options */}
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
            Tap the correct item:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full mb-6">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isAnswer = opt === currentQ.answer;

              return (
                <button
                  key={idx}
                  onClick={() => handleChoose(opt)}
                  disabled={selectedOption !== null}
                  className={`h-24 sm:h-28 rounded-3xl border-4 flex items-center justify-center text-5xl shadow-md transition-all transform active:scale-95 ${
                    isSelected
                      ? isAnswer
                        ? 'bg-emerald-100 border-emerald-500 ring-4 ring-emerald-300'
                        : 'bg-red-100 border-red-500 ring-4 ring-red-300'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-teal-500'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Done Modal */}
      {isDone && (
        <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-xl text-center">
          <Award className="w-14 h-14 text-teal-600 mx-auto mb-2" />
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
            Pattern Exercise Finished!
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            You got <strong>{correctCount} of {questions.length}</strong> patterns correct!
          </p>
          <button
            onClick={onBack}
            className="w-full py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-lg shadow-lg"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
