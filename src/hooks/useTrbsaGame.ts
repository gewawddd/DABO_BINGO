import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createShuffledDeck } from '../utils/trbsa';

export interface TrbsaGameState {
  started: boolean;
  deck: number[];
  drawn: number[];
  current: number | null;
  previous: number | null;
  calledSet: Set<number>;
  remaining: number;
  count: number;
  complete: boolean;
}

export interface TrbsaGameApi extends TrbsaGameState {
  start: () => void;
  next: () => void;
  reset: () => void;
}

export function useTrbsaGame(): TrbsaGameApi {
  const [deck, setDeck] = useState<number[]>(() => createShuffledDeck());
  const [drawn, setDrawn] = useState<number[]>([]);
  const [started, setStarted] = useState(false);

  const start = useCallback(() => {
    setDeck(createShuffledDeck());
    setDrawn([]);
    setStarted(true);
  }, []);

  const next = useCallback(() => {
    setDrawn((prevDrawn) => {
      if (prevDrawn.length >= 75) return prevDrawn;
      // ensure started
      setStarted(true);
      // use current deck snapshot — but deck is stable until reset/start, so pop by index
      const nextNumber = deck[prevDrawn.length];
      if (nextNumber == null) return prevDrawn;
      return [...prevDrawn, nextNumber];
    });
  }, [deck]);

  const reset = useCallback(() => {
    setDeck(createShuffledDeck());
    setDrawn([]);
    setStarted(false);
  }, []);

  const calledSet = useMemo(() => new Set(drawn), [drawn]);
  const current = drawn.length > 0 ? drawn[drawn.length - 1] : null;
  const previous = drawn.length > 1 ? drawn[drawn.length - 2] : null;

  return {
    started,
    deck,
    drawn,
    current,
    previous,
    calledSet,
    remaining: 75 - drawn.length,
    count: drawn.length,
    complete: drawn.length === 75,
    start,
    next,
    reset
  };
}

/** Auto-play timer hook. */
export function useAutoPlay(
enabled: boolean,
intervalMs: number,
onTick: () => void,
paused: boolean)
{
  const cb = useRef(onTick);
  useEffect(() => {
    cb.current = onTick;
  }, [onTick]);
  useEffect(() => {
    if (!enabled || paused) return;
    const id = window.setInterval(() => cb.current(), intervalMs);
    return () => window.clearInterval(id);
  }, [enabled, intervalMs, paused]);
}