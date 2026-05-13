import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLetterForNumber, LETTER_COLOR } from '../utils/trbsa';
interface CallHistoryProps {
  drawn: number[];
}
export function CallHistory({ drawn }: CallHistoryProps) {
  // most recent first, exclude the current (last) call
  const history = drawn.slice(0, -1).slice(-12).reverse();
  return (
    <div className="flex flex-col gap-2">
      <div className="text-[10px] uppercase tracking-[0.35em] text-white/40 px-1">
        Recent Calls
      </div>
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        <AnimatePresence initial={false}>
          {history.length === 0 &&
          <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            className="text-white/30 text-sm italic">
            
              No previous calls yet
            </motion.div>
          }
          {history.map((n, idx) => {
            const letter = getLetterForNumber(n);
            const isRed = LETTER_COLOR[letter] === 'red';
            return (
              <motion.div
                key={`${n}-${idx}`}
                initial={{
                  opacity: 0,
                  scale: 0.6,
                  y: 10
                }}
                animate={{
                  opacity: 1 - idx * 0.06,
                  scale: 1,
                  y: 0
                }}
                exit={{
                  opacity: 0,
                  scale: 0.6
                }}
                transition={{
                  type: 'spring',
                  stiffness: 320,
                  damping: 22,
                  delay: idx * 0.02
                }}
                className={[
                'shrink-0 w-16 h-16 rounded-full flex flex-col items-center justify-center font-display border-2',
                isRed ?
                'bg-brand-red/15 border-brand-red/60 text-brand-red' :
                'bg-brand-blue/15 border-brand-blue/60 text-brand-blue'].
                join(' ')}>
                
                <span className="text-xs leading-none opacity-80">
                  {letter}
                </span>
                <span className="text-xl font-bold leading-none mt-0.5">
                  {n}
                </span>
              </motion.div>);

          })}
        </AnimatePresence>
      </div>
    </div>);

}