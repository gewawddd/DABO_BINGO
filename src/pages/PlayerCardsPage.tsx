import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { CardGrid } from '../components/CardGrid';
import { createRandomCard, isTrbsaCard, type TrbsaCard } from '../utils/trbsa';

const STORAGE_KEY = 'trbsa-player-card-v1';

function loadStoredCard(): TrbsaCard | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return isTrbsaCard(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function PlayerCardsPage() {
  const [card, setCard] = useState<TrbsaCard>(() => loadStoredCard() ?? createRandomCard());
  const [marked, setMarked] = useState<Set<number>>(() => new Set());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(card));
  }, [card]);

  const handleGenerate = useCallback(() => {
    setCard(createRandomCard());
    setMarked(new Set());
  }, []);

  const handleToggleCell = useCallback((index: number) => {
    setMarked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const handlePrint = useCallback(() => {
    if (typeof window === 'undefined') return;
    window.print();
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg text-white">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-8 sm:py-10">
        <header className="flex flex-col gap-5 sm:gap-6 md:flex-row md:items-center md:justify-between print-hide">
          <div className="flex flex-col gap-3">
            <Logo size="lg" showTag={false} />
            <div className="text-sm sm:text-base text-white/70">
              Your TRBSA card is generated once per device. Refresh to keep it, or
              regenerate for a new random card.
            </div>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={handleGenerate}
              className="w-full sm:w-auto rounded-xl border border-brand-blue/50 bg-brand-blue/15 px-4 py-2 text-xs uppercase tracking-[0.35em] text-brand-blue hover:bg-brand-blue/25">
              Generate New Card
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="w-full sm:w-auto rounded-xl border border-brand-red/50 bg-brand-red/15 px-4 py-2 text-xs uppercase tracking-[0.35em] text-brand-red hover:bg-brand-red/25">
              Print Card
            </button>
            <Link
              to="/playercards/print"
              className="w-full sm:w-auto rounded-xl border border-brand-green/50 bg-brand-green/15 px-4 py-2 text-xs uppercase tracking-[0.35em] text-brand-green hover:bg-brand-green/25 text-center">
              Print 30 Cards
            </Link>
          </div>
        </header>

        <section className="mt-8 sm:mt-10 print-card flex justify-center">
          <CardGrid
            card={card}
            className="w-full max-w-[520px]"
            marked={marked}
            onToggleCell={handleToggleCell}
          />
        </section>

        <div className="mt-6 sm:mt-8 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-white/60 print-hide">
          Each device keeps its own card in local storage. Clearing storage gives you a new card.
        </div>
      </div>
    </div>
  );
}
