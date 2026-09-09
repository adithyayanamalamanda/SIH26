import React from 'react';
import {
  Award,
  Clock,
  Target,
  TrendingUp,
  ArrowRight,
  Home,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';

export default function PerformanceSummary({
  resultData,
  patientHistory,
  onPlayNext,
  onGoHome,
  highContrast
}) {
  const {
    accuracy = 0,
    responseTime = 0,
    performanceScore = 0,
    difficultyLevel = 1,
    nextDifficultyLevel = 1,
    adaptiveAction = 'maintain',
    scoreBreakdown = {},
    feedbackMessage = ''
  } = resultData || {};

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col items-center">
      {/* Top Banner */}
      <div className="w-full text-center mb-6">
        <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold text-sm mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Cognitive Evaluation Summary</span>
        </span>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-2">
          Performance Summary
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-300">
          Transparent metrics recorded for this session.
        </p>
      </div>

      {/* 5 Core Metric Cards (Exact Prompt Specifications) */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-8">
        {/* 1. Accuracy */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-slate-700 shadow-sm text-center">
          <div className="flex items-center justify-center text-blue-600 mb-1">
            <Target className="w-6 h-6" />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">Accuracy</p>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            {accuracy}%
          </p>
        </div>

        {/* 2. Response Time */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-amber-200 dark:border-slate-700 shadow-sm text-center">
          <div className="flex items-center justify-center text-amber-600 mb-1">
            <Clock className="w-6 h-6" />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">Response Time</p>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            {Math.round(responseTime)}s
          </p>
        </div>

        {/* 3. Performance Score */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-emerald-200 dark:border-slate-700 shadow-sm text-center">
          <div className="flex items-center justify-center text-emerald-600 mb-1">
            <Award className="w-6 h-6" />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">Score</p>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {Math.round(performanceScore)}
          </p>
        </div>

        {/* 4. Current Level */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-indigo-200 dark:border-slate-700 shadow-sm text-center">
          <div className="flex items-center justify-center text-indigo-600 mb-1">
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">Current Level</p>
          <p className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            Level {difficultyLevel}
          </p>
        </div>

        {/* 5. Next Challenge Level */}
        <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border-2 border-purple-300 dark:border-purple-800 shadow-sm text-center col-span-2 sm:col-span-1">
          <div className="flex items-center justify-center text-purple-600 mb-1">
            <Sparkles className="w-6 h-6" />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-purple-700 dark:text-purple-300">Next Challenge</p>
          <p className="text-2xl sm:text-3xl font-black text-purple-700 dark:text-purple-300 mt-1">
            Level {nextDifficultyLevel}
          </p>
        </div>
      </div>

      {/* Adaptive Decision Card */}
      <div className="w-full p-6 rounded-3xl bg-blue-50 dark:bg-slate-800/80 border-2 border-blue-200 dark:border-slate-700 mb-8 text-left">
        <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300 font-bold text-lg mb-2">
          <Info className="w-5 h-5" />
          <span>Adaptive Progression Logic</span>
        </div>
        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
          {scoreBreakdown.explanation || `Score: ${performanceScore}. `}
          {adaptiveAction === 'increase' && (
            <span className="font-bold text-emerald-700 dark:text-emerald-400">
              {' '}Performance score is \(\ge 80\): difficulty increased to Level {nextDifficultyLevel}.
            </span>
          )}
          {adaptiveAction === 'maintain' && (
            <span className="font-bold text-blue-700 dark:text-blue-400">
              {' '}Performance score is 60–79: staying at Level {difficultyLevel} to build comfort.
            </span>
          )}
          {adaptiveAction === 'decrease' && (
            <span className="font-bold text-amber-700 dark:text-amber-400">
              {' '}Adjusting to Level {nextDifficultyLevel} for a gentler pace with fewer items.
            </span>
          )}
        </p>
      </div>

      {/* Primary Action Buttons */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
        <button
          onClick={onPlayNext}
          className={`w-full sm:w-auto flex-1 py-6 px-8 rounded-3xl font-extrabold text-2xl shadow-xl transform active:scale-95 transition-all flex items-center justify-center space-x-3 ${
            highContrast
              ? 'bg-amber-400 hover:bg-amber-300 text-black border-4 border-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/25'
          }`}
          style={{ minHeight: '80px' }}
        >
          <span>Play Next Challenge (Level {nextDifficultyLevel})</span>
          <ArrowRight className="w-8 h-8" />
        </button>

        <button
          onClick={onGoHome}
          className="w-full sm:w-auto px-8 py-6 rounded-3xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xl flex items-center justify-center gap-3 transition-all"
          style={{ minHeight: '80px' }}
        >
          <Home className="w-7 h-7" />
          <span>Home</span>
        </button>
      </div>

      {/* Patient Longitudinal History (Saved Sessions) */}
      {patientHistory && patientHistory.sessions && patientHistory.sessions.length > 0 && (
        <div className="w-full p-6 rounded-3xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 shadow-sm text-left">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
            <span>Recent Sessions for Patient {patientHistory.patientId}</span>
            <span className="text-sm font-normal text-slate-500">
              Avg Accuracy: {patientHistory.averageAccuracy}% • Avg Score: {patientHistory.averageScore}
            </span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm sm:text-base">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-semibold">
                  <th className="py-2">Time</th>
                  <th className="py-2">Level</th>
                  <th className="py-2">Accuracy</th>
                  <th className="py-2">Response Time</th>
                  <th className="py-2">Score</th>
                  <th className="py-2">Next Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {patientHistory.sessions.slice(0, 5).map((s, idx) => (
                  <tr key={s.sessionId || idx}>
                    <td className="py-3 font-mono text-xs sm:text-sm">
                      {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 font-bold">Level {s.difficultyLevel}</td>
                    <td className="py-3 text-emerald-600 font-bold">{s.accuracy}%</td>
                    <td className="py-3">{Math.round(s.responseTime)}s</td>
                    <td className="py-3 font-bold">{Math.round(s.performanceScore)}</td>
                    <td className="py-3 font-bold text-purple-600">Level {s.nextDifficultyLevel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
