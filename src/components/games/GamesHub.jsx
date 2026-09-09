import React from 'react';
import { Brain, Play, Award, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

const GAMES_LIST = [
  {
    id: 'memory_recall',
    title: 'Adaptive Memory Recall',
    desc: 'Remember familiar North Eastern objects and pick them from a group.',
    emoji: '🧠',
    color: 'from-blue-600 to-indigo-600',
    tag: 'Core SIH Module',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
  },
  {
    id: 'memory_matching',
    title: 'Memory Card Matching',
    desc: 'Flip cards and match pairs of traditional crafts, instruments and tea cups.',
    emoji: '🎴',
    color: 'from-emerald-600 to-teal-600',
    tag: 'Pair Finding',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
  },
  {
    id: 'sequence_recall',
    title: 'Sequence Recall',
    desc: 'Remember and reproduce the chronological order of familiar items.',
    emoji: '🔢',
    color: 'from-purple-600 to-pink-600',
    tag: 'Chronological',
    badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
  },
  {
    id: 'pattern_recognition',
    title: 'Pattern Recognition',
    desc: 'Look at the repeating pattern and figure out what comes next.',
    emoji: '🧩',
    color: 'from-amber-500 to-orange-600',
    tag: 'Logic & Attention',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
  },
  {
    id: 'daily_routine',
    title: 'Daily Routine Recall',
    desc: 'Place morning steps like brushing, breakfast and medicine in order.',
    emoji: '🌅',
    color: 'from-sky-600 to-cyan-600',
    tag: 'Life Independence',
    badgeColor: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
  }
];

export default function GamesHub({
  onSelectGame,
  currentLevel = 1,
  onBack,
  highContrast
}) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white font-bold transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Home</span>
          </button>
        )}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-sm ml-auto">
          <Award className="w-5 h-5" />
          <span>Current Difficulty: Level {currentLevel}</span>
        </div>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-3">
          Cognitive Games Suite
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Choose a gentle brain exercise to practice memory, focus, and daily routines.
        </p>
      </div>

      {/* 5 Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {GAMES_LIST.map((game) => (
          <div
            key={game.id}
            onClick={() => onSelectGame(game.id)}
            className={`p-6 sm:p-8 rounded-3xl border-2 transition-all transform hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col justify-between ${
              highContrast
                ? 'bg-slate-900 border-amber-400 text-white'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-md hover:border-blue-500'
            }`}
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <span className="text-5xl select-none p-3 rounded-2xl bg-slate-100 dark:bg-slate-700">
                  {game.emoji}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${game.badgeColor}`}>
                  {game.tag}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                {game.title}
              </h3>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                {game.desc}
              </p>
            </div>

            <button
              className={`w-full py-4 px-6 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all ${
                highContrast
                  ? 'bg-amber-400 text-black'
                  : `bg-gradient-to-r ${game.color} text-white shadow-md hover:opacity-95`
              }`}
            >
              <Play className="w-6 h-6 fill-current" />
              <span>Play Now</span>
              <ArrowRight className="w-5 h-5 ml-auto" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
