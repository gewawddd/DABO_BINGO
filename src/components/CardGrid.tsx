import React from 'react';
import { LETTERS, LETTER_COLOR, type TrbsaCard } from '../utils/trbsa';

interface CardGridProps {
  card: TrbsaCard;
  className?: string;
  marked?: Set<number>;
  onToggleCell?: (index: number) => void;
}

export function CardGrid({ card, className, marked, onToggleCell }: CardGridProps) {
  const wrapperClass = ['card-grid rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-4', className]
    .filter(Boolean)
    .join(' ');
  const isInteractive = Boolean(onToggleCell);
  return (
    <div className={wrapperClass}>
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-[16px] sm:text-lg md:text-xl uppercase tracking-[0.4em] sm:tracking-[0.45em]">
        {LETTERS.map((letter) => {
          const tone = LETTER_COLOR[letter];
          return (
          <div
            key={letter}
            data-tone={tone}
            className={[
              'card-letter text-center font-display font-bold',
              tone === 'blue' ? 'card-letter-blue text-brand-blue' : 'card-letter-red text-brand-red'
            ].join(' ')}>
            {letter}
          </div>
          );
        })}
      </div>
      <div className="mt-2 grid grid-cols-5 gap-1.5 sm:gap-2">
        {card.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isFree = cell === 'FREE';
            const index = rowIndex * 5 + colIndex;
            const isMarked = marked?.has(index);
            const tone = LETTER_COLOR[LETTERS[colIndex]];
            const toneClass =
              tone === 'blue'
                ? 'card-cell-blue text-brand-blue border-brand-blue/60 bg-brand-blue/10'
                : 'card-cell-red text-brand-red border-brand-red/60 bg-brand-red/10';
            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                type="button"
                onClick={isInteractive ? () => onToggleCell?.(index) : undefined}
                aria-pressed={isInteractive ? Boolean(isMarked) : undefined}
                aria-label={isFree ? 'Free space' : `Number ${cell}`}
                data-tone={tone}
                className={[
                  'card-cell aspect-square rounded-lg border border-white/10 flex items-center justify-center text-xs sm:text-sm md:text-base font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70',
                  isInteractive ? 'cursor-pointer hover:border-white/40' : 'cursor-default',
                  isMarked ? 'ring-2 ring-brand-blue/70 shadow-glow-blue card-cell-marked' : '',
                  isFree
                    ? 'card-cell-free bg-brand-red/20 text-brand-red text-[10px] sm:text-xs tracking-[0.22em]'
                    : toneClass
                ].join(' ')}>
                {isFree ? 'FREE' : cell}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
