import { useEffect } from 'react';

interface Handlers {
  onNext: () => void;
  onReset: () => void;
  onFullscreen: () => void;
  onOpenWinner?: () => void;
}

export function useKeyboardShortcuts({
  onNext,
  onReset,
  onFullscreen,
  onOpenWinner
}: Handlers) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
      target && (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable))
      {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        onNext();
      } else if (e.key === 'r' || e.key === 'R') {
        onReset();
      } else if (e.key === 'f' || e.key === 'F') {
        onFullscreen();
      } else if (e.key === 'w' || e.key === 'W') {
        onOpenWinner?.();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onNext, onReset, onFullscreen, onOpenWinner]);
}