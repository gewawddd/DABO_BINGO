import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LETTERS, LETTER_COLOR, type TrbsaLetter } from '../utils/trbsa';
interface MainBoardProps {
  calledSet: Set<number>;
  current: number | null;
}
const ROW_RANGES: Record<TrbsaLetter, [number, number]> = {
  T: [1, 15],
  R: [16, 30],
  B: [31, 45],
  S: [46, 60],
  A: [61, 75]
};
export function MainBoard({ calledSet, current }: MainBoardProps) {
  return (
    <div className="glass rounded-3xl p-6 flex flex-col gap-3">
      {LETTERS.map((letter) => {
        const [lo, hi] = ROW_RANGES[letter];
        const numbers: number[] = [];
        for (let n = lo; n <= hi; n++) numbers.push(n);
        const color = LETTER_COLOR[letter];
        return (
          <div key={letter} className="flex items-center gap-4">
            {/* Letter badge */}
            <div
              className={[
              'w-16 h-16 rounded-2xl flex items-center justify-center font-display text-4xl font-bold shrink-0',
              color === 'blue' ?
              'bg-brand-blue/15 border border-brand-blue/50 text-brand-blue shadow-[0_0_22px_rgba(14,165,233,0.25)]' :
              'bg-brand-red/15 border border-brand-red/50 text-brand-red shadow-[0_0_22px_rgba(239,68,68,0.25)]'].
              join(' ')}>
              
              {letter}
            </div>
            {/* Number cells */}
            <div
              className="grid grid-cols-15 flex-1 gap-2"
              style={{
                gridTemplateColumns: 'repeat(15, minmax(0,1fr))'
              }}>
              
              {numbers.map((n) => {
                const isCalled = calledSet.has(n);
                const isCurrent = current === n;
                return (
                  <NumberCell
                    key={n}
                    n={n}
                    called={isCalled}
                    current={isCurrent}
                    accent={color} />);


              })}
            </div>
          </div>);

      })}
    </div>);

}
interface NumberCellProps {
  n: number;
  called: boolean;
  current: boolean;
  accent: 'blue' | 'red';
}
function NumberCell({ n, called, current }: NumberCellProps) {
  return (
    <div className="relative aspect-square">
      <AnimatePresence>
        {called &&
        <motion.div
          key="called"
          initial={{
            scale: 0.6,
            opacity: 0
          }}
          animate={{
            scale: 1,
            opacity: 1
          }}
          transition={{
            type: 'spring',
            stiffness: 380,
            damping: 22
          }}
          className={[
          'absolute inset-0 rounded-xl flex items-center justify-center font-display font-bold text-xl',
          current ?
          'bg-brand-red/20 text-white shadow-glow-red ring-2 ring-brand-red' :
          'bg-brand-blue/20 text-white shadow-glow-blue'].
          join(' ')}>
          
            {current &&
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-xl ring-2 ring-brand-red"
            animate={{
              opacity: [0.9, 0.3, 0.9]
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity
            }} />

          }
            <span className="relative">{n}</span>
          </motion.div>
        }
      </AnimatePresence>
      {!called &&
      <div className="absolute inset-0 rounded-xl bg-white/[0.025] border border-white/10 flex items-center justify-center font-display font-semibold text-base text-white/35">
          {n}
        </div>
      }
    </div>);

}