import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { createRandomCard, LETTERS, LETTER_COLOR } from '../utils/trbsa';
interface MiniCardProps {
  calledSet: Set<number>;
  patternSet: Set<number>;
  onTogglePatternCell: (index: number) => void;
}
export function MiniCard({ calledSet, patternSet, onTogglePatternCell }: MiniCardProps) {
  const card = useMemo(() => createRandomCard(), []);
  const patternImage = '/2x2%20malala.png';
  return (
    <div className="glass rounded-2xl p-3">
      <div className="grid grid-cols-5 gap-1 mb-2">
        {LETTERS.map((l) =>
        <div
          key={l}
          className={`text-center font-display font-bold text-sm tracking-widest ${LETTER_COLOR[l] === 'blue' ? 'text-brand-blue' : 'text-brand-red'}`}>
          
            {l}
          </div>
        )}
      </div>
      <div className="grid grid-cols-5 gap-1">
        {card.flat().map((cell, idx) => {
          const isFree = cell === 'FREE';
          const isCalled = !isFree && calledSet.has(cell as number);
          const isPattern = patternSet.has(idx);
          return (
            <motion.button
              key={idx}
              type="button"
              initial={false}
              animate={{
                scale: isCalled ? [1, 1.08, 1] : 1
              }}
              transition={{
                duration: 0.35
              }}
              onClick={() => onTogglePatternCell(idx)}
              aria-pressed={isPattern}
              aria-label={isFree ? 'Free space' : `Number ${cell as number}`}
              className={[
              'group relative aspect-square rounded-md overflow-hidden flex items-center justify-center text-[11px] font-semibold transition-shadow',
              isFree ?
              'bg-brand-red/20 border border-brand-red/50 text-brand-red text-[8px] uppercase tracking-wider' :
              isCalled ?
              'bg-brand-blue/20 border border-brand-blue/60 text-white shadow-glow-blue' :
              'bg-white/[0.03] border border-white/10 text-white/55',
              isPattern ?
              'ring-2 ring-white/80 shadow-[0_0_14px_rgba(255,255,255,0.35)]' :
              ''].
              join(' ')}>
              <motion.span
                aria-hidden
                initial={false}
                animate={{
                  opacity: isPattern ? 1 : 0,
                  scale: isPattern ? 1 : 0.96
                }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 20
                }}
                className={[
                'absolute inset-1 rounded-full bg-center bg-cover',
                isPattern && isFree ? 'bg-brand-red/15' :
                isPattern && isCalled ? 'bg-brand-blue/15' :
                isPattern ? 'bg-white/5' :
                ''].join(' ')}
                style={
                  isPattern ?
                  {
                    backgroundImage:
                      `linear-gradient(140deg, rgba(14,165,233,0.25), rgba(239,68,68,0.25)), url(${patternImage})`
                  } :
                  undefined
                } />

              {isPattern &&
              <motion.span
                aria-hidden
                initial={{
                  opacity: 0,
                  scale: 0.6
                }}
                animate={{
                  opacity: [0.8, 0],
                  scale: [0.6, 1.6]
                }}
                transition={{
                  duration: 0.6,
                  ease: 'easeOut'
                }}
                className={[
                'absolute inset-1 rounded-md blur-md',
                isFree ? 'bg-brand-red/30' :
                'bg-brand-blue/30'].
                join(' ')} />
              }

              <span className="relative z-10" aria-hidden />
            </motion.button>);

        })}
      </div>
    </div>);

}