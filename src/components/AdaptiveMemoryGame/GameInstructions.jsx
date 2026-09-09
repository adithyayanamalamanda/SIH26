import React from 'react';
import { Eye, Clock, CheckCircle2, Volume2, ArrowRight, ArrowLeft } from 'lucide-react';

export default function GameInstructions({
  level,
  targetCount,
  viewingSeconds,
  onProceed,
  onGoBack,
  speakText,
  highContrast
}) {
  const instructionText = `Here is how we play: Step 1. Look at the ${targetCount} familiar pictures shown on your screen. Step 2. Remember them before the ${viewingSeconds} second timer runs out. Step 3. Tap on the pictures you remember seeing. Take your time!`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col items-center">
      {/* Top navigation */}
      <div className="w-full flex justify-between items-center mb-6">
        <button
          onClick={onGoBack}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>

        <button
          onClick={() => speakText(instructionText)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-100 dark:bg-indigo-950 hover:bg-indigo-200 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-lg transition-all"
          title="Read instructions aloud"
        >
          <Volume2 className="w-6 h-6" />
          <span>Read Aloud</span>
        </button>
      </div>

      {/* Screen Title */}
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
          How to Play (Level {level})
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-300">
          Follow these 3 simple steps at your own comfortable pace.
        </p>
      </div>

      {/* 3 Step Cards */}
      <div className="w-full space-y-5 mb-8">
        <div className="p-6 rounded-3xl bg-blue-50 dark:bg-slate-800/80 border-2 border-blue-200 dark:border-slate-700 flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl flex-shrink-0 shadow-md">
            1
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <Eye className="w-6 h-6 text-blue-600" />
              <span>Look Carefully</span>
            </h3>
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              You will see <strong className="text-blue-700 dark:text-blue-400 font-bold">{targetCount} familiar pictures</strong> on the screen. Look closely at each one.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-amber-50 dark:bg-slate-800/80 border-2 border-amber-200 dark:border-slate-700 flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-2xl flex-shrink-0 shadow-md">
            2
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <Clock className="w-6 h-6 text-amber-600" />
              <span>Remember Them</span>
            </h3>
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              You have <strong className="text-amber-700 dark:text-amber-400 font-bold">{viewingSeconds} seconds</strong> to remember them. Then, they will be hidden.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-slate-800/80 border-2 border-emerald-200 dark:border-slate-700 flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-2xl flex-shrink-0 shadow-md">
            3
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <span>Tap What You Saw</span>
            </h3>
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              Pick out the objects you saw from a group of items. Take all the time you need!
            </p>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="w-full max-w-md">
        <button
          onClick={() => {
            speakText("Here come the pictures. Look carefully!");
            onProceed();
          }}
          className={`w-full py-6 px-8 rounded-3xl font-extrabold text-2xl sm:text-3xl shadow-xl transform active:scale-95 transition-all flex items-center justify-center space-x-4 ${
            highContrast
              ? 'bg-amber-400 hover:bg-amber-300 text-black border-4 border-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/25'
          }`}
          style={{ minHeight: '80px' }}
        >
          <span>I am Ready - Let&apos;s Begin</span>
          <ArrowRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
