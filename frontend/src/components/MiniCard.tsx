import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { createRandomCard, LETTERS, LETTER_COLOR } from '../utils/trbsa';
interface MiniCardProps {
  calledSet: Set<number>;
}
export function MiniCard({ calledSet }: MiniCardProps) {
  const card = useMemo(() => createRandomCard(), []);
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
          return (
            <motion.div
              key={idx}
              initial={false}
              animate={{
                scale: isCalled ? [1, 1.08, 1] : 1
              }}
              transition={{
                duration: 0.35
              }}
              className={[
              'aspect-square rounded-md flex items-center justify-center text-[11px] font-semibold',
              isFree ?
              'bg-brand-red/20 border border-brand-red/50 text-brand-red text-[8px] uppercase tracking-wider' :
              isCalled ?
              'bg-brand-blue/20 border border-brand-blue/60 text-white shadow-glow-blue' :
              'bg-white/[0.03] border border-white/10 text-white/55'].
              join(' ')}>
              
              {isFree ? 'Free' : cell as number}
            </motion.div>);

        })}
      </div>
    </div>);

}