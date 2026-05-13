import React, { useCallback, useMemo, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import {
  PlayIcon,
  SkipForwardIcon,
  RotateCcwIcon,
  Volume2Icon,
  VolumeXIcon,
  MaximizeIcon,
  TimerIcon,
  PauseIcon } from
'lucide-react';
import { Logo } from './Logo';
import { MiniCard } from './MiniCard';
import { formatCall } from '../utils/trbsa';
interface SidebarProps {
  count: number;
  previous: number | null;
  started: boolean;
  complete: boolean;
  calledSet: Set<number>;
  soundOn: boolean;
  autoPlay: boolean;
  autoInterval: number;
  onStart: () => void;
  onNext: () => void;
  onReset: () => void;
  onOpenWinner: () => void;
  onToggleSound: () => void;
  onToggleAutoPlay: () => void;
  onSetAutoInterval: (s: number) => void;
  onFullscreen: () => void;
}
export function Sidebar(props: SidebarProps) {
  const {
    count,
    previous,
    started,
    complete,
    calledSet,
    soundOn,
    autoPlay,
    autoInterval,
    onStart,
    onNext,
    onReset,
    onOpenWinner,
    onToggleSound,
    onToggleAutoPlay,
    onSetAutoInterval,
    onFullscreen
  } = props;
  const emptyCalledSet = useMemo(() => new Set<number>(), []);
  const [patternSet, setPatternSet] = useState<Set<number>>(() => new Set());
  const shuffleControls = useAnimationControls();
  const handleTogglePatternCell = useCallback((index: number) => {
    setPatternSet((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);
  const handleClearPattern = useCallback(() => {
    setPatternSet(new Set());
  }, []);
  const handleResetClick = useCallback(() => {
    shuffleControls.start({
      rotate: [0, -2, 2, 0],
      y: [0, -2, 0],
      transition: {
        duration: 0.35
      }
    });
    onReset();
  }, [onReset, shuffleControls]);
  return (
    <aside className="app-sidebar w-[340px] shrink-0 h-screen p-5 flex flex-col gap-4 border-r border-white/5 bg-black/30 backdrop-blur-md">
      <Logo size="md" />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mt-2">
        <div className="glass rounded-2xl p-3">
          <div className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-1">
            Calls
          </div>
          <div className="font-display text-3xl text-white leading-none">
            {count}
            <span className="text-white/40 text-xl"> / 75</span>
          </div>
        </div>
        <div className="glass rounded-2xl p-3">
          <div className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-1">
            Previous
          </div>
          <div className="font-display text-3xl text-brand-blue leading-none">
            {previous != null ? formatCall(previous) : '—'}
          </div>
        </div>
      </div>

      {/* Mini preview card */}
      <div>
        <div className="flex items-center justify-between mb-1 px-1">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
            Preview Card
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/30">5 x 5</span>
            <button
              type="button"
              onClick={handleClearPattern}
              className="text-[10px] uppercase tracking-[0.25em] text-white/45 hover:text-white/80">
              Clear
            </button>
          </div>
        </div>
        <div className="text-[10px] uppercase tracking-[0.28em] text-white/25 px-1 mb-2">
          Click squares to set pattern
        </div>
        <MiniCard
          calledSet={started ? emptyCalledSet : calledSet}
          patternSet={patternSet}
          onTogglePatternCell={handleTogglePatternCell} />
      </div>

      {/* Primary controls */}
      <div className="flex flex-col gap-2 mt-1">
        {!started ?
        <motion.button
          whileHover={{
            y: -1
          }}
          whileTap={{
            scale: 0.98
          }}
          onClick={onStart}
          className="flex items-center justify-center gap-2 h-14 rounded-2xl bg-brand-blue hover:bg-brand-blueDeep text-white font-display text-xl tracking-wider shadow-glow-blue transition-colors">
          
            <PlayIcon className="w-5 h-5" />
            Start Game
          </motion.button> :

        <motion.button
          whileHover={{
            y: -1
          }}
          whileTap={{
            scale: 0.97
          }}
          onClick={onNext}
          disabled={complete}
          className="flex items-center justify-center gap-2 h-14 rounded-2xl bg-brand-blue hover:bg-brand-blueDeep disabled:bg-white/10 disabled:text-white/30 disabled:shadow-none text-white font-display text-xl tracking-wider shadow-glow-blue transition-colors">
          
            <SkipForwardIcon className="w-5 h-5" />
            {complete ? 'Complete' : 'Next Call'}
            <span className="ml-1 text-[10px] font-sans uppercase tracking-widest opacity-70">
              Space
            </span>
          </motion.button>
        }

        <motion.button
          whileHover={{
            y: -1
          }}
          whileTap={{
            scale: 0.98
          }}
          animate={shuffleControls}
          onClick={handleResetClick}
          className="flex items-center justify-center gap-2 h-12 rounded-2xl bg-brand-red/15 hover:bg-brand-red/25 border border-brand-red/40 text-brand-red font-medium tracking-wide">
          
          <RotateCcwIcon className="w-4 h-4" />
          Shuffle / Reset
          <span className="ml-1 text-[10px] uppercase tracking-widest opacity-70">
            R
          </span>
        </motion.button>

        <motion.button
          whileHover={{
            y: -1
          }}
          whileTap={{
            scale: 0.98
          }}
          onClick={onOpenWinner}
          className="flex items-center justify-center gap-2 h-11 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/75 font-medium tracking-wide">
          Winner Modal
        </motion.button>
      </div>

      {/* Secondary controls */}
      <div className="mt-auto flex flex-col gap-2">
        <div className="glass rounded-2xl p-3 flex flex-col gap-3">
          <button
            onClick={onToggleAutoPlay}
            className="flex items-center justify-between text-sm">
            
            <span className="flex items-center gap-2 text-white/80">
              {autoPlay ?
              <PauseIcon className="w-4 h-4 text-brand-red" /> :

              <TimerIcon className="w-4 h-4 text-brand-blue" />
              }
              Auto Play
            </span>
            <span
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${autoPlay ? 'bg-brand-blue' : 'bg-white/10'}`}>
              
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoPlay ? 'translate-x-4' : 'translate-x-0.5'}`} />
              
            </span>
          </button>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] uppercase tracking-widest text-white/40">
              Interval
            </span>
            <div className="flex gap-1">
              {[3, 5, 10].map((s) =>
              <button
                key={s}
                onClick={() => onSetAutoInterval(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${autoInterval === s ? 'bg-brand-blue text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>
                
                  {s}s
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onToggleSound}
            className="glass rounded-2xl py-3 flex items-center justify-center gap-2 text-sm text-white/80 hover:text-white">
            
            {soundOn ?
            <Volume2Icon className="w-4 h-4 text-brand-blue" /> :

            <VolumeXIcon className="w-4 h-4 text-white/40" />
            }
            Sound
          </button>
          <button
            onClick={onFullscreen}
            className="glass rounded-2xl py-3 flex items-center justify-center gap-2 text-sm text-white/80 hover:text-white">
            
            <MaximizeIcon className="w-4 h-4 text-brand-blue" />
            Fullscreen
            <span className="text-[9px] uppercase tracking-widest opacity-60">
              F
            </span>
          </button>
        </div>
      </div>
    </aside>);

}