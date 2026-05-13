import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './components/Sidebar';
import { MainBoard } from './components/MainBoard';
import { CurrentBall } from './components/CurrentBall';
import { CallHistory } from './components/CallHistory';
import { Confetti } from './components/Confetti';
import { Logo } from './components/Logo';
import { useTrbsaGame, useAutoPlay } from './hooks/useTrbsaGame';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useCallEffects } from './hooks/useCallEffects';
import { formatCall } from './utils/trbsa';
export function App() {
  const game = useTrbsaGame();
  const [soundOn, setSoundOn] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoInterval, setAutoInterval] = useState(5);
  useCallEffects(game.current, soundOn);
  useAutoPlay(
    autoPlay && game.started && !game.complete,
    autoInterval * 1000,
    game.next,
    false
  );
  const handleFullscreen = useCallback(() => {
    const el = document.documentElement;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => undefined);
    } else {
      document.exitFullscreen?.().catch(() => undefined);
    }
  }, []);
  useKeyboardShortcuts({
    onNext: game.next,
    onReset: game.reset,
    onFullscreen: handleFullscreen
  });
  return (
    <div className="flex w-full min-h-screen bg-brand-bg text-white">
      <Sidebar
        count={game.count}
        previous={game.previous}
        started={game.started}
        complete={game.complete}
        calledSet={game.calledSet}
        soundOn={soundOn}
        autoPlay={autoPlay}
        autoInterval={autoInterval}
        onStart={game.start}
        onNext={game.next}
        onReset={() => {
          game.reset();
          setAutoPlay(false);
        }}
        onToggleSound={() => setSoundOn((s) => !s)}
        onToggleAutoPlay={() => setAutoPlay((a) => !a)}
        onSetAutoInterval={setAutoInterval}
        onFullscreen={handleFullscreen} />
      

      <main className="flex-1 min-w-0 h-screen overflow-auto flex flex-col">
        {/* Top status bar */}
        <header className="flex items-center justify-between px-8 pt-6 pb-2">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity
              }}
              className={`w-2.5 h-2.5 rounded-full ${game.started && !game.complete ? 'bg-brand-red' : 'bg-white/30'}`} />
            
            <span className="text-[10px] uppercase tracking-[0.45em] text-white/50">
              {game.complete ?
              'Round Complete' :
              game.started ?
              'Live Round' :
              'Standby'}
            </span>
          </div>
          <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.35em] text-white/40">
            <span>
              <span className="text-white/70">SPACE</span> · Next
            </span>
            <span>
              <span className="text-white/70">R</span> · Reset
            </span>
            <span>
              <span className="text-white/70">F</span> · Fullscreen
            </span>
          </div>
        </header>

        {/* Main board */}
        <div className="px-8 pt-4">
          <MainBoard calledSet={game.calledSet} current={game.current} />
        </div>

        {/* Bottom section */}
        <div className="px-8 pb-8 pt-6 mt-auto grid grid-cols-12 gap-8 items-center">
          <div className="col-span-4">
            <CurrentBall current={game.current} />
          </div>
          <div className="col-span-5">
            <CallHistory drawn={game.drawn} />
            <div className="mt-4 text-[11px] uppercase tracking-[0.35em] text-white/40">
              {game.current != null ?
              <span>
                  Now Calling{' '}
                  <span className="text-white font-bold tracking-widest ml-2">
                    {formatCall(game.current)}
                  </span>
                </span> :

              <span>Press Start to begin the round</span>
              }
            </div>
          </div>
          <div className="col-span-3 flex justify-end">
            <div className="glass-blue rounded-3xl p-6 flex flex-col items-end gap-2">
              <Logo size="lg" showTag={false} />
              <div className="text-[10px] uppercase tracking-[0.5em] text-brand-blue/80">
                Caller Edition · 75
              </div>
            </div>
          </div>
        </div>

        {/* aria-live screen-reader announcer */}
        <div className="sr-only" aria-live="polite">
          {game.current != null ? `New call: ${formatCall(game.current)}` : ''}
        </div>
      </main>

      <Confetti active={game.complete} />
    </div>);

}