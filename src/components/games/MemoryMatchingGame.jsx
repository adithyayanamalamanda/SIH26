import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCcw, ArrowLeft, Award, CheckCircle2, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

const PAIR_ITEMS = [
  { id: 'tea', emoji: '☕', label: 'Assam Tea' },
  { id: 'gamusa', emoji: '🧣', label: 'Gamusa Shawl' },
  { id: 'jaapi', emoji: '👒', label: 'Bamboo Jaapi' },
  { id: 'dhol', emoji: '🥁', label: 'Bihu Dhol' },
  { id: 'diya', emoji: '🪔', label: 'Clay Diya' },
  { id: 'flute', emoji: '🪈', label: 'Bamboo Flute' },
  { id: 'flower', emoji: '🌼', label: 'Marigold' },
  { id: 'basket', emoji: '🧺', label: 'Bamboo Basket' }
];

export default function MemoryMatchingGame({
  difficultyLevel = 1,
  onComplete,
  onBack,
  highContrast
}) {
  // Difficulty levels: Level 1: 3 pairs (6 cards), Level 2: 4 pairs (8 cards), Level 3: 6 pairs (12 cards), Level 4: 8 pairs (16 cards)
  const pairCount = difficultyLevel === 1 ? 3 : difficultyLevel === 2 ? 4 : difficultyLevel === 3 ? 6 : 8;

  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [moves, setMoves] = useState(0);
  const [startTime] = useState(Date.now());
  const [isGameOver, setIsGameOver] = useState(false);

  // Initialize card deck
  useEffect(() => {
    const selected = PAIR_ITEMS.slice(0, pairCount);
    const deck = [];
    selected.forEach((item, idx) => {
      deck.push({ ...item, uniqueId: `${item.id}_1` });
      deck.push({ ...item, uniqueId: `${item.id}_2` });
    });
    // Shuffle deck
    setCards(deck.sort(() => 0.5 - Math.random()));
    setFlippedIndices([]);
    setMatchedIds([]);
    setMoves(0);
    setIsGameOver(false);
  }, [pairCount]);

  const handleCardClick = (index) => {
    if (flippedIndices.length === 2 || flippedIndices.includes(index)) return;
    const clickedCard = cards[index];
    if (matchedIds.includes(clickedCard.id)) return;

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const firstCard = cards[newFlipped[0]];
      const secondCard = cards[newFlipped[1]];

      if (firstCard.id === secondCard.id) {
        // Matched!
        const nextMatched = [...matchedIds, firstCard.id];
        setMatchedIds(nextMatched);
        setFlippedIndices([]);

        if (nextMatched.length === pairCount) {
          // Game Completed!
          const elapsed = (Date.now() - startTime) / 1000;
          setIsGameOver(true);
          try {
            confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
          } catch (e) {}

          const accuracy = Math.round((pairCount / Math.max(moves + 1, pairCount)) * 100);
          const score = Math.max(40, Math.min(100, Math.round(accuracy * 0.7 + Math.max(0, 30 - elapsed))));

          if (onComplete) {
            onComplete({
              gameType: 'memory_matching',
              difficultyLevel,
              accuracy,
              responseTime: elapsed,
              attempts: moves + 1,
              hintsUsed: 0,
              performanceScore: score,
              recommendedNextLevel: score >= 80 ? Math.min(difficultyLevel + 1, 4) : difficultyLevel
            });
          }
        }
      } else {
        // Not a match: flip back after brief pause
        setTimeout(() => {
          setFlippedIndices([]);
        }, 1100);
      }
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

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold text-sm">
            Level {difficultyLevel} • {pairCount} Pairs
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-sm">
            Moves: {moves}
          </span>
        </div>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
          Memory Matching (Find Pairs)
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Tap two cards at a time to find matching cultural objects.
        </p>
      </div>

      {/* Card Grid */}
      <div className={`w-full grid gap-4 mb-8 ${
        cards.length <= 6
          ? 'grid-cols-2 sm:grid-cols-3 max-w-xl'
          : cards.length <= 8
          ? 'grid-cols-2 sm:grid-cols-4 max-w-2xl'
          : cards.length <= 12
          ? 'grid-cols-3 sm:grid-cols-4 max-w-3xl'
          : 'grid-cols-4 sm:grid-cols-4 max-w-3xl'
      }`}>
        {cards.map((card, idx) => {
          const isFlipped = flippedIndices.includes(idx) || matchedIds.includes(card.id);
          const isMatched = matchedIds.includes(card.id);

          return (
            <button
              key={card.uniqueId}
              onClick={() => handleCardClick(idx)}
              className={`h-32 sm:h-36 rounded-3xl border-4 flex flex-col items-center justify-center p-3 text-center transition-all transform active:scale-95 shadow-md ${
                isMatched
                  ? 'bg-emerald-100 dark:bg-emerald-950 border-emerald-500 text-emerald-900 dark:text-emerald-200 opacity-90'
                  : isFlipped
                  ? 'bg-white dark:bg-slate-800 border-blue-500 text-slate-900 dark:text-white scale-102 ring-4 ring-blue-300/40'
                  : highContrast
                  ? 'bg-slate-900 text-amber-300 border-slate-700 hover:border-amber-400'
                  : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-700'
              }`}
            >
              {isFlipped ? (
                <>
                  <span className="text-4xl sm:text-5xl select-none mb-1">{card.emoji}</span>
                  <span className="text-xs sm:text-sm font-extrabold leading-tight">{card.label}</span>
                  {isMatched && <span className="text-xs text-emerald-600 font-bold mt-1">✓ Matched</span>}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <span className="text-4xl text-white/80">❓</span>
                  <span className="text-xs font-bold text-white/80 mt-1">Tap to Flip</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Success Modal / Banner */}
      {isGameOver && (
        <div className="w-full max-w-md p-6 rounded-3xl bg-emerald-50 dark:bg-slate-800 border-2 border-emerald-400 text-center shadow-xl animate-fade-in">
          <Award className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
            All Pairs Found!
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            You completed the exercise in <strong>{moves} moves</strong>.
          </p>
          <button
            onClick={onBack}
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xl shadow-lg transition-all"
          >
            Continue to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
