import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './components/Sidebar';
import { MainBoard } from './components/MainBoard';
import { CurrentBall } from './components/CurrentBall';
import { CallHistory } from './components/CallHistory';
import { Confetti } from './components/Confetti';
import { Logo } from './components/Logo';
import { useTrbsaGame, useAutoPlay } from './hooks/useTrbsaGame';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useCallEffects } from './hooks/useCallEffects';
import { formatCall, getLetterForNumber, LETTER_COLOR } from './utils/trbsa';
export function App() {
  const game = useTrbsaGame();
  const [soundOn, setSoundOn] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoInterval, setAutoInterval] = useState(5);
  const [winnerOpen, setWinnerOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const winnerAudioRef = useRef<{ crowd?: HTMLAudioElement; fireworks?: HTMLAudioElement; confetti?: HTMLAudioElement }>({});
  const playWinnerSounds = useCallback(() => {
    const crowd = winnerAudioRef.current.crowd ??
      new Audio('/freesound_community-cheering-and-clapping-crowd-1-5995.mp3');
    const fireworks = winnerAudioRef.current.fireworks ??
      new Audio('/dragon-studio-fireworks-07-419025.mp3');
    const confetti = winnerAudioRef.current.confetti ??
      new Audio('/u_jspnqv1glx-1gift-confetti-447240.mp3');
    crowd.volume = 0.75;
    fireworks.volume = 0.55;
    confetti.volume = 0.45;
    crowd.loop = true;
    fireworks.loop = true;
    confetti.loop = true;
    winnerAudioRef.current = { crowd, fireworks, confetti };
    crowd.currentTime = 0;
    fireworks.currentTime = 0;
    confetti.currentTime = 0;
    crowd.play().catch(() => undefined);
    fireworks.play().catch(() => undefined);
    confetti.play().catch(() => undefined);
  }, []);
  const stopWinnerSounds = useCallback(() => {
    const { crowd, fireworks, confetti } = winnerAudioRef.current;
    crowd?.pause();
    fireworks?.pause();
    confetti?.pause();
    if (crowd) crowd.currentTime = 0;
    if (fireworks) fireworks.currentTime = 0;
    if (confetti) confetti.currentTime = 0;
  }, []);
  useEffect(() => {
    if (!soundOn) stopWinnerSounds();
  }, [soundOn, stopWinnerSounds]);
  const handleOpenWinner = useCallback(() => {
    if (soundOn) playWinnerSounds();
    setWinnerOpen(true);
  }, [playWinnerSounds, soundOn]);
  const handleCloseWinner = useCallback(() => {
    stopWinnerSounds();
    setWinnerOpen(false);
  }, [stopWinnerSounds]);
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
    <div className="app-shell flex w-full min-h-screen bg-brand-bg text-white">
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
        onOpenWinner={handleOpenWinner}
        onToggleSound={() => setSoundOn((s) => !s)}
        onToggleAutoPlay={() => setAutoPlay((a) => !a)}
        onSetAutoInterval={setAutoInterval}
        onFullscreen={handleFullscreen} />
      

      <main className="app-main flex-1 min-w-0 h-screen overflow-auto flex flex-col">
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
        <div className="app-board px-8 pt-4">
          <MainBoard calledSet={game.calledSet} current={game.current} />
        </div>

        {/* Bottom section */}
        <div className="app-bottom px-8 pb-8 pt-6 mt-auto grid grid-cols-12 gap-8 items-center">
          <div className="col-span-4">
            <CurrentBall current={game.current} />
          </div>
          <div className="col-span-5">
            <CallHistory
              drawn={game.drawn}
              onOpenHistory={() => setHistoryOpen(true)} />
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

      <AnimatePresence>
        {historyOpen &&
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="history-title"
          aria-describedby="history-description"
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          onClick={() => setHistoryOpen(false)}>

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.94,
              y: 10
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              scale: 0.96,
              y: 10
            }}
            transition={{
              type: 'spring',
              stiffness: 280,
              damping: 24
            }}
            onClick={(event) => event.stopPropagation()}
            className="w-[720px] max-w-[94vw] rounded-3xl bg-[#1d1f23] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.55)] px-8 py-7">

            <button
              type="button"
              onClick={() => setHistoryOpen(false)}
              aria-label="Close call history"
              className="absolute top-4 right-4 w-9 h-9 rounded-full border border-white/10 text-white/70 hover:text-white hover:border-white/40 bg-white/5 flex items-center justify-center">
              ×
            </button>

            <div
              id="history-title"
              className="text-center text-2xl font-display text-white">
              Call History
            </div>
            <div
              id="history-description"
              className="text-center text-white/70 mt-2">
              Check out the previous calls from most recent to oldest, left to right.
            </div>

            <div className="mt-6 max-h-[360px] overflow-auto pr-2">
              <div className="flex flex-wrap gap-4">
                {[...game.drawn].reverse().map((n, idx) => {
                  const letter = getLetterForNumber(n);
                  const isRed = LETTER_COLOR[letter] === 'red';
                  return (
                    <div
                      key={`${n}-${idx}`}
                      className={[
                      'w-20 h-20 rounded-full flex flex-col items-center justify-center font-display border-4 shadow-[inset_0_0_12px_rgba(255,255,255,0.12)]',
                      isRed ?
                      'bg-brand-red/25 border-brand-red/80 text-white' :
                      'bg-brand-blue/25 border-brand-blue/80 text-white'].
                      join(' ')}>

                      <span className="text-xs opacity-80">{letter}</span>
                      <span className="text-2xl font-bold leading-none">{n}</span>
                    </div>);
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
        }
      </AnimatePresence>

      <AnimatePresence>
        {winnerOpen &&
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="winner-title"
          aria-describedby="winner-message"
          className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm"
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          onClick={handleCloseWinner}>

          <WinnerCelebration />

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 10
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 10
            }}
            transition={{
              type: 'spring',
              stiffness: 280,
              damping: 22
            }}
            onClick={(event) => event.stopPropagation()}
            className="relative z-10 w-[560px] max-w-[92vw]">

            <div className="relative rounded-[28px] px-10 py-8 text-center bg-gradient-to-b from-[#ff4d4d] via-[#c91d1d] to-[#7d0b0b] border-[3px] border-[#ffd166] shadow-[0_0_40px_rgba(255,209,102,0.55)]">
              <div className="absolute inset-2 rounded-[22px] border border-white/15" />
              <BulbRing />
              <button
                type="button"
                onClick={handleCloseWinner}
                aria-label="Close winner modal"
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full border border-yellow-200/40 text-yellow-100/90 hover:text-white hover:border-yellow-200 bg-black/10 flex items-center justify-center">
                ×
              </button>
              <div className="relative z-10">
                <div className="text-[11px] uppercase tracking-[0.45em] text-yellow-100/80">
                  Winner
                </div>
                <div
                  id="winner-title"
                  className="font-display text-5xl sm:text-6xl tracking-[0.22em] mt-3 text-transparent bg-clip-text bg-gradient-to-b from-[#fff3b0] via-[#ffd166] to-[#f59e0b]"
                  style={{
                    textShadow: '0 6px 12px rgba(0,0,0,0.45)'
                  }}>
                  YOU WIN
                </div>
                <div
                  id="winner-message"
                  className="text-white/85 mt-3 text-base">
                  Congratulations you're the winner
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        }
      </AnimatePresence>
    </div>);

}

const PARTY_COLORS = ['#0ea5e9', '#38bdf8', '#ef4444', '#f87171', '#ffffff', '#fde68a'];
function WinnerCelebration() {
  const rays = useMemo(
    () => ({
      backgroundImage:
        'repeating-conic-gradient(from 0deg, rgba(255,255,255,0.16) 0deg 10deg, rgba(255,255,255,0) 10deg 20deg)',
      maskImage: 'radial-gradient(circle at 50% 40%, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)',
      WebkitMaskImage: 'radial-gradient(circle at 50% 40%, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)'
    }) as React.CSSProperties,
    []
  );
  const orbiters = useMemo(
    () => [
      {
        id: 'orbiter-1',
        radius: 220,
        size: 64,
        duration: 11,
        delay: 0
      },
      {
        id: 'orbiter-2',
        radius: 300,
        size: 72,
        duration: 14,
        delay: 0.4
      },
      {
        id: 'orbiter-3',
        radius: 380,
        size: 56,
        duration: 18,
        delay: 0.8
      },
      {
        id: 'orbiter-4',
        radius: 260,
        size: 48,
        duration: 12,
        delay: 1.1
      },
      {
        id: 'orbiter-5',
        radius: 440,
        size: 52,
        duration: 20,
        delay: 0.2
      },
      {
        id: 'orbiter-6',
        radius: 520,
        size: 60,
        duration: 24,
        delay: 0.6
      }
    ],
    []
  );
  const sparkles = useMemo(
    () =>
    Array.from({
      length: 16
    }, (_, i) => ({
      id: `sparkle-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 3 + Math.random() * 3,
      delay: Math.random() * 1.2,
      color: PARTY_COLORS[Math.floor(Math.random() * PARTY_COLORS.length)]
    })),
    []
  );
  const confetti = useMemo(
    () =>
    Array.from({
      length: 52
    }, (_, i) => ({
      id: `confetti-${i}`,
      x: Math.random() * 100,
      delay: Math.random() * 0.6,
      duration: 1.6 + Math.random() * 1.2,
      rotate: Math.random() * 720 - 360,
      size: 6 + Math.random() * 8,
      color: PARTY_COLORS[Math.floor(Math.random() * PARTY_COLORS.length)],
      drift: (Math.random() - 0.5) * 30
    })),
    []
  );
  const burstOrigins = useMemo(
    () => [
      {
        id: 'burst-1',
        x: '-6%',
        y: '22%',
        delay: 0.15
      },
      {
        id: 'burst-2',
        x: '106%',
        y: '18%',
        delay: 0.35
      },
      {
        id: 'burst-3',
        x: '12%',
        y: '-8%',
        delay: 0.55
      },
      {
        id: 'burst-4',
        x: '86%',
        y: '108%',
        delay: 0.75
      },
      {
        id: 'burst-5',
        x: '-8%',
        y: '74%',
        delay: 0.95
      },
      {
        id: 'burst-6',
        x: '108%',
        y: '68%',
        delay: 1.15
      },
      {
        id: 'burst-7',
        x: '28%',
        y: '110%',
        delay: 1.35
      },
      {
        id: 'burst-8',
        x: '72%',
        y: '-10%',
        delay: 1.55
      }
    ],
    []
  );
  const burstPieces = useMemo(
    () =>
    burstOrigins.flatMap((burst) =>
    Array.from({
      length: 20
    }, (_, i) => {
      const angle = i / 20 * Math.PI * 2 + Math.random() * 0.5;
      const distance = 44 + Math.random() * 62;
      return {
        id: `${burst.id}-${i}`,
        originX: burst.x,
        originY: burst.y,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        size: 4 + Math.random() * 5,
        delay: burst.delay + Math.random() * 0.35,
        color: PARTY_COLORS[Math.floor(Math.random() * PARTY_COLORS.length)]
      };
    })),
    [burstOrigins]
  );
  const fireworks = useMemo(
    () => [
      {
        id: 'firework-1',
        x: '8%',
        y: '16%',
        size: 90,
        color: '#38bdf8',
        delay: 0.1
      },
      {
        id: 'firework-2',
        x: '76%',
        y: '18%',
        size: 80,
        color: '#f87171',
        delay: 0.35
      },
      {
        id: 'firework-3',
        x: '54%',
        y: '72%',
        size: 70,
        color: '#ffffff',
        delay: 0.6
      },
      {
        id: 'firework-4',
        x: '22%',
        y: '60%',
        size: 85,
        color: '#fde68a',
        delay: 0.85
      },
      {
        id: 'firework-5',
        x: '88%',
        y: '58%',
        size: 78,
        color: '#38bdf8',
        delay: 1.1
      },
      {
        id: 'firework-6',
        x: '46%',
        y: '6%',
        size: 96,
        color: '#f87171',
        delay: 1.35
      }
    ],
    []
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 35%, rgba(126,34,206,0.55), rgba(18,8,42,0.95) 70%)'
        }} />
      <div className="absolute inset-0 opacity-80" style={rays} />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 55%, rgba(255,255,255,0.14), rgba(0,0,0,0) 60%)'
        }} />

      <div className="absolute inset-0 z-0">
        {fireworks.map((fx) =>
        <motion.div
          key={fx.id}
          initial={{
            opacity: 0,
            scale: 0.4
          }}
          animate={{
            opacity: [0, 0.95, 0],
            scale: [0.4, 1.2, 1.7]
          }}
          transition={{
            duration: 1.6,
            delay: fx.delay,
            repeat: Infinity,
            repeatDelay: 1.1
          }}
          className="absolute rounded-full"
          style={{
            left: fx.x,
            top: fx.y,
            width: fx.size,
            height: fx.size,
            background: `radial-gradient(circle, ${fx.color} 0%, rgba(0,0,0,0) 60%)`,
            filter: 'blur(0.2px)'
          }} />
        )}
      </div>

      <div className="absolute inset-0 z-10">
        {orbiters.map((orbiter) =>
        <motion.div
          key={orbiter.id}
          className="absolute left-1/2 top-1/2"
          style={{
            width: 0,
            height: 0
          }}
          animate={{
            rotate: 360
          }}
          transition={{
            duration: orbiter.duration,
            ease: 'linear',
            repeat: Infinity,
            delay: orbiter.delay
          }}>

          <motion.img
            src="/2x2%20malala.png"
            alt="Winner"
            className="rounded-full border-2 border-white/60 shadow-[0_0_18px_rgba(255,255,255,0.45)]"
            style={{
              width: orbiter.size,
              height: orbiter.size,
              transform: `translateX(${orbiter.radius}px)`
            }}
            animate={{
              rotate: -360
            }}
            transition={{
              duration: orbiter.duration * 0.75,
              ease: 'linear',
              repeat: Infinity
            }} />
        </motion.div>
        )}
      </div>

      <div className="absolute inset-0 z-20">
        {confetti.map((p) =>
        <motion.div
          key={p.id}
          initial={{
            y: -30,
            x: `${p.x}%`,
            opacity: 0,
            rotate: 0
          }}
          animate={{
            y: '120%',
            x: `calc(${p.x}% + ${p.drift}px)`,
            opacity: [0, 1, 1, 0],
            rotate: p.rotate
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeIn',
            repeat: Infinity,
            repeatDelay: 0.9
          }}
          style={{
            position: 'absolute',
            top: -10,
            width: p.size,
            height: p.size * 0.45,
            background: p.color,
            borderRadius: 2
          }} />
        )}

        {sparkles.map((s) =>
        <motion.span
          key={s.id}
          initial={{
            opacity: 0,
            scale: 0.6
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.6, 1.4, 0.6]
          }}
          transition={{
            duration: 1.3,
            delay: s.delay,
            repeat: Infinity,
            repeatDelay: 0.9,
            ease: 'easeInOut'
          }}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: s.color,
            filter: 'blur(0.3px)'
          }} />
        )}

        {burstPieces.map((p) =>
        <motion.span
          key={p.id}
          initial={{
            opacity: 0,
            scale: 0.6,
            x: 0,
            y: 0
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.6, 1, 0.8],
            x: p.dx,
            y: p.dy,
            rotate: 360
          }}
          transition={{
            duration: 1.15,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: 0.9,
            ease: 'easeOut'
          }}
          className="absolute rounded-sm"
          style={{
            left: p.originX,
            top: p.originY,
            width: p.size,
            height: p.size * 0.5,
            background: p.color
          }} />
        )}
      </div>
    </div>
  );
}

function BulbRing() {
  const bulbsTop = Array.from({ length: 10 });
  const bulbsSide = Array.from({ length: 6 });
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute top-2 left-5 right-5 flex justify-between">
        {bulbsTop.map((_, i) =>
        <span
          key={`bulb-top-${i}`}
          className="bulb"
          style={{
            animationDelay: `${i * 0.08}s`
          }} />
        )}
      </div>
      <div className="absolute bottom-2 left-5 right-5 flex justify-between">
        {bulbsTop.map((_, i) =>
        <span
          key={`bulb-bottom-${i}`}
          className="bulb"
          style={{
            animationDelay: `${(i + 3) * 0.08}s`
          }} />
        )}
      </div>
      <div className="absolute left-2 top-5 bottom-5 flex flex-col justify-between">
        {bulbsSide.map((_, i) =>
        <span
          key={`bulb-left-${i}`}
          className="bulb"
          style={{
            animationDelay: `${(i + 6) * 0.08}s`
          }} />
        )}
      </div>
      <div className="absolute right-2 top-5 bottom-5 flex flex-col justify-between">
        {bulbsSide.map((_, i) =>
        <span
          key={`bulb-right-${i}`}
          className="bulb"
          style={{
            animationDelay: `${(i + 9) * 0.08}s`
          }} />
        )}
      </div>
    </div>
  );
}