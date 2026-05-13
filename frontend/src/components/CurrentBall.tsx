import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLetterForNumber, LETTER_COLOR } from '../utils/trbsa';
interface CurrentBallProps {
  current: number | null;
}
export function CurrentBall({ current }: CurrentBallProps) {
  return (
    <div className="flex items-center gap-6">
      <div className="text-[10px] uppercase tracking-[0.45em] text-white/40 [writing-mode:vertical-rl] rotate-180">
        Current Call
      </div>
      <div className="relative w-64 h-64">
        <AnimatePresence mode="wait">
          {current == null ?
          <motion.div
            key="empty"
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            exit={{
              opacity: 0
            }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-white/15 flex items-center justify-center text-white/40 font-display text-xl">
            
              Ready
            </motion.div> :

          <Ball key={current} n={current} />
          }
        </AnimatePresence>
      </div>
    </div>);

}
function Ball({ n }: {n: number;}) {
  const letter = getLetterForNumber(n);
  const isRed = LETTER_COLOR[letter] === 'red';
  return (
    <motion.div
      initial={{
        scale: 0.2,
        y: -180,
        opacity: 0,
        rotate: -25
      }}
      animate={{
        scale: 1,
        y: 0,
        opacity: 1,
        rotate: 0
      }}
      exit={{
        scale: 0.5,
        opacity: 0,
        y: 40
      }}
      transition={{
        type: 'spring',
        stiffness: 220,
        damping: 16,
        mass: 0.9
      }}
      className="absolute inset-0 rounded-full"
      role="status"
      aria-live="polite"
      aria-label={`Current call ${letter} ${n}`}>
      
      {/* outer glow */}
      <div
        className={`absolute inset-0 rounded-full blur-2xl opacity-70 ${isRed ? 'bg-brand-red' : 'bg-brand-blue'}`} />
      
      {/* main ball */}
      <div
        className={`relative w-full h-full rounded-full flex flex-col items-center justify-center overflow-hidden border-4 ${isRed ? 'border-brand-red shadow-glow-red' : 'border-brand-blue shadow-glow-blue'}`}
        style={{
          background: isRed ?
          'radial-gradient(circle at 30% 25%, #ff7b7b 0%, #ef4444 35%, #7f1d1d 100%)' :
          'radial-gradient(circle at 30% 25%, #7dd3fc 0%, #0ea5e9 35%, #0c4a6e 100%)'
        }}>
        
        {/* gloss */}
        <div className="absolute top-3 left-6 w-20 h-12 rounded-full bg-white/35 blur-xl" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="font-display text-5xl font-bold text-white/95 tracking-widest leading-none">
            {letter}
          </div>
          <div className="w-20 h-px bg-white/40 my-2" />
          <div className="font-display text-7xl font-bold text-white leading-none drop-shadow-lg">
            {n}
          </div>
        </div>
      </div>
    </motion.div>);

}