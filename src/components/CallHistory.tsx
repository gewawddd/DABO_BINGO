import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLetterForNumber, LETTER_COLOR } from '../utils/trbsa';
interface CallHistoryProps {
  drawn: number[];
  onOpenHistory?: () => void;
}
export function CallHistory({ drawn, onOpenHistory }: CallHistoryProps) {
  // most recent first, exclude the current (last) call
  const history = drawn.slice(0, -1).slice(-12).reverse();
  const hasHistory = drawn.length > 0;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">
          Recent Calls
        </div>
        <button
          type="button"
          onClick={onOpenHistory}
          disabled={!hasHistory}
          className="text-[10px] uppercase tracking-[0.3em] text-white/45 hover:text-white/80 disabled:text-white/20">
          History
        </button>
      </div>
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 pr-6">
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
              const isNewest = idx === 0;
              return (
                <motion.div
                  key={`${n}-${idx}`}
                  initial={{
                    opacity: 0,
                    x: isNewest ? 18 : 0
                  }}
                  animate={{
                    opacity: 1 - idx * 0.06,
                    x: 0
                  }}
                  exit={{
                    opacity: 0,
                    x: isNewest ? -12 : 0
                  }}
                  transition={{
                    duration: 0.22,
                    ease: 'easeOut',
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
      </div>
    </div>);

}