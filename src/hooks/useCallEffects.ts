import { useCallback, useEffect, useRef } from 'react';
import { formatCall, getLetterForNumber } from '../utils/trbsa';

/** Plays a short beep + (optional) speech announcement for each new call. */
export function useCallEffects(current: number | null, soundOn: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  const lastSpokenRef = useRef<number | null>(null);

  const ensureCtx = useCallback(() => {
    if (!ctxRef.current && typeof window !== 'undefined') {
      const Ctor =
      window.AudioContext ||
      (window as unknown as {webkitAudioContext: typeof AudioContext;}).
      webkitAudioContext;
      if (Ctor) ctxRef.current = new Ctor();
    }
    return ctxRef.current;
  }, []);

  useEffect(() => {
    if (current == null) return;
    if (lastSpokenRef.current === current) return;
    lastSpokenRef.current = current;
    if (!soundOn) return;

    // beep
    const ctx = ensureCtx();
    if (ctx) {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.26);
      } catch {

        // ignore
      }}

    // speech
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(
          `${getLetterForNumber(current)} ${current}`
        );
        u.rate = 0.95;
        u.pitch = 1;
        u.volume = 0.9;
        window.speechSynthesis.speak(u);
      } catch {

        // ignore
      }}
  }, [current, soundOn, ensureCtx]);

  return { formatCall };
}