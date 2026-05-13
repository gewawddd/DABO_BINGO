import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { CardGrid } from '../components/CardGrid';
import { createUniqueCards, isTrbsaCard, type TrbsaCard } from '../utils/trbsa';

const STORAGE_KEY = 'trbsa-player-cards-batch-v1';
const CARD_COUNT = 30;
const PAGE_SIZE = 6;

function loadStoredCards(): TrbsaCard[] | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length !== CARD_COUNT) return null;
    return parsed.every(isTrbsaCard) ? parsed : null;
  } catch {
    return null;
  }
}

export function PlayerCardsPrintPage() {
  const [cards, setCards] = useState<TrbsaCard[]>(
    () => loadStoredCards() ?? createUniqueCards(CARD_COUNT)
  );

  useEffect(() => {
    if (cards.length !== CARD_COUNT) {
      setCards(createUniqueCards(CARD_COUNT));
    }
  }, [cards.length]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }, [cards]);

  const handleGenerate = useCallback(() => {
    setCards(createUniqueCards(CARD_COUNT));
  }, []);

  const handlePrint = useCallback(() => {
    if (typeof window === 'undefined') return;
    window.print();
  }, []);

  const pages = useMemo(() => {
    const result: TrbsaCard[][] = [];
    for (let i = 0; i < cards.length; i += PAGE_SIZE) {
      result.push(cards.slice(i, i + PAGE_SIZE));
    }
    return result;
  }, [cards]);

  return (
    <div className="min-h-screen bg-brand-bg text-white">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 sm:py-10">
        <header className="flex flex-col gap-5 sm:gap-6 md:flex-row md:items-center md:justify-between print-hide">
          <div className="flex flex-col gap-3">
            <Logo size="lg" showTag={false} />
            <div className="text-sm sm:text-base text-white/70">
              Print 30 unique player cards on legal paper. Each page fits six cards.
            </div>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={handleGenerate}
              className="w-full sm:w-auto rounded-xl border border-brand-blue/50 bg-brand-blue/15 px-4 py-2 text-xs uppercase tracking-[0.35em] text-brand-blue hover:bg-brand-blue/25">
              Generate New Set
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="w-full sm:w-auto rounded-xl border border-brand-red/50 bg-brand-red/15 px-4 py-2 text-xs uppercase tracking-[0.35em] text-brand-red hover:bg-brand-red/25">
              Print 30 Cards
            </button>
            <Link
              to="/playercards"
              className="w-full sm:w-auto rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/70 hover:bg-white/10 text-center">
              Single Card
            </Link>
          </div>
        </header>

        <div className="mt-8 space-y-8">
          {pages.map((pageCards, pageIndex) => {
            const filledCards = Array.from({ length: PAGE_SIZE }, (_, idx) => pageCards[idx] ?? null);
            return (
              <section
                key={`page-${pageIndex}`}
                className="print-page rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">
                <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 print-batch-grid">
                  {filledCards.map((card, cardIndex) =>
                    card ?
                    <CardGrid
                      key={`card-${pageIndex}-${cardIndex}`}
                      card={card}
                      className="print-card"
                    /> :
                    <div
                      key={`empty-${pageIndex}-${cardIndex}`}
                      className="rounded-2xl border border-white/10 bg-white/[0.02] opacity-0" />
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
