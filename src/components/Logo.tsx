import React from 'react';
import { LETTERS, LETTER_COLOR } from '../utils/trbsa';
interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTag?: boolean;
}
const SIZE_MAP = {
  sm: 'text-2xl',
  md: 'text-4xl',
  lg: 'text-6xl',
  xl: 'text-8xl'
};
export function Logo({ size = 'md', showTag = true }: LogoProps) {
  return (
    <div className="flex flex-col items-start gap-1">
      <div
        className={`font-display font-bold tracking-[0.18em] flex items-baseline gap-[0.05em] ${SIZE_MAP[size]}`}>
        
        {LETTERS.map((l) =>
        <span
          key={l}
          className={
          LETTER_COLOR[l] === 'blue' ? 'text-brand-blue' : 'text-brand-red'
          }
          style={{
            textShadow:
            LETTER_COLOR[l] === 'blue' ?
            '0 0 18px rgba(14,165,233,0.55)' :
            '0 0 18px rgba(239,68,68,0.55)'
          }}>
          
            {l}
          </span>
        )}
      </div>
      {showTag &&
      <div className="text-[10px] uppercase tracking-[0.45em] text-white/40 font-medium">
          Live Caller System
        </div>
      }
    </div>);

}