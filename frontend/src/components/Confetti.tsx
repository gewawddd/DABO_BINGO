import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
interface ConfettiProps {
  active: boolean;
}
const COLORS = ['#0ea5e9', '#38bdf8', '#ef4444', '#f87171', '#ffffff'];
export function Confetti({ active }: ConfettiProps) {
  const particles = useMemo(
    () =>
    Array.from(
      {
        length: 90
      },
      (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2.4 + Math.random() * 2,
        rotate: Math.random() * 720 - 360,
        size: 6 + Math.random() * 10,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        drift: (Math.random() - 0.5) * 40
      })
    ),
    []
  );
  if (!active) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((p) =>
      <motion.div
        key={p.id}
        initial={{
          y: -40,
          x: `${p.x}vw`,
          opacity: 0,
          rotate: 0
        }}
        animate={{
          y: '110vh',
          x: `calc(${p.x}vw + ${p.drift}px)`,
          opacity: [0, 1, 1, 0],
          rotate: p.rotate
        }}
        transition={{
          duration: p.duration,
          delay: p.delay,
          ease: 'easeIn',
          repeat: Infinity,
          repeatDelay: 1.5
        }}
        style={{
          position: 'absolute',
          top: 0,
          width: p.size,
          height: p.size * 0.4,
          background: p.color,
          borderRadius: 2
        }} />

      )}
      <motion.div
        initial={{
          opacity: 0,
          y: -20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="absolute top-10 left-1/2 -translate-x-1/2 glass rounded-2xl px-6 py-3">
        
        <div className="font-display text-2xl text-white tracking-widest">
          <span className="text-brand-blue">ALL</span> 75{' '}
          <span className="text-brand-red">CALLED</span>
        </div>
      </motion.div>
    </div>);

}