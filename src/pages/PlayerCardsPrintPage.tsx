import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { CardGrid } from '../components/CardGrid';
import { createUniqueCards, isTrbsaCard, type TrbsaCard } from '../utils/trbsa';

const STORAGE_KEY = 'trbsa-player-cards-batch-v1';
const CARD_COUNT = 30;
const PAGE_SIZE = 9;

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
  const [eventTitle, setEventTitle] = useState('TRBSA Live Room');
  const [setLabel, setSetLabel] = useState('Set A');
  const [showCardIds, setShowCardIds] = useState(true);
  const [showNameLine, setShowNameLine] = useState(true);
  const [showCutGuides, setShowCutGuides] = useState(true);

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
  const normalizedTitle = eventTitle.trim();
  const normalizedSetLabel = setLabel.trim();

  return (
    <div className="min-h-screen bg-brand-bg text-white">
      <div className="print-root mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 sm:py-10">
        <header className="flex flex-col gap-5 sm:gap-6 md:flex-row md:items-center md:justify-between print-hide">
          <div className="flex flex-col gap-3">
            <Logo size="lg" showTag={false} />
            <div className="text-sm sm:text-base text-white/70">
              Print {CARD_COUNT} unique player cards on long bond paper. Each page fits {PAGE_SIZE} cards.
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/30 bg-amber-200/10 px-3 py-1 text-[10px] uppercase tracking-[0.45em] text-amber-100/80">
              Live Room Print Studio
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
              Print {CARD_COUNT} Cards
            </button>
            <Link
              to="/playercards"
              className="w-full sm:w-auto rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/70 hover:bg-white/10 text-center">
              Single Card
            </Link>
          </div>
        </header>

        <section className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] print-hide">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <div className="text-xs uppercase tracking-[0.4em] text-amber-100/70">Card header</div>
            <div className="mt-2 text-sm text-white/60">
              Add an event label and batch tag so players can verify their set.
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-[11px] uppercase tracking-[0.35em] text-white/45">
                Event Title
                <input
                  value={eventTitle}
                  onChange={(event) => setEventTitle(event.target.value)}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 focus:outline-none focus:ring-2 focus:ring-amber-200/30"
                  placeholder="TRBSA Live Room" />
              </label>
              <label className="flex flex-col gap-2 text-[11px] uppercase tracking-[0.35em] text-white/45">
                Batch Label
                <input
                  value={setLabel}
                  onChange={(event) => setSetLabel(event.target.value)}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 focus:outline-none focus:ring-2 focus:ring-amber-200/30"
                  placeholder="Set A" />
              </label>
            </div>
          </div>
          <div className="rounded-3xl border border-emerald-200/20 bg-emerald-950/30 p-5">
            <div className="text-xs uppercase tracking-[0.4em] text-emerald-100/70">Print options</div>
            <div className="mt-4 space-y-3 text-sm text-white/75">
              <label className="flex items-center justify-between gap-3">
                <span>Show card IDs</span>
                <input
                  type="checkbox"
                  checked={showCardIds}
                  onChange={(event) => setShowCardIds(event.target.checked)}
                  className="h-4 w-4 rounded border border-white/20 bg-white/10 text-emerald-200" />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Show name line</span>
                <input
                  type="checkbox"
                  checked={showNameLine}
                  onChange={(event) => setShowNameLine(event.target.checked)}
                  className="h-4 w-4 rounded border border-white/20 bg-white/10 text-emerald-200" />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Show cut guides</span>
                <input
                  type="checkbox"
                  checked={showCutGuides}
                  onChange={(event) => setShowCutGuides(event.target.checked)}
                  className="h-4 w-4 rounded border border-white/20 bg-white/10 text-emerald-200" />
              </label>
            </div>
            <div className="mt-4 text-xs text-white/50">
              Print options only affect the paper output, not gameplay.
            </div>
          </div>
        </section>

        <div className="mt-8 space-y-8">
          {pages.map((pageCards, pageIndex) => {
            const filledCards = Array.from({ length: PAGE_SIZE }, (_, idx) => pageCards[idx] ?? null);
            return (
              <section
                key={`page-${pageIndex}`}
                className="print-page rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">
                <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 print-batch-grid">
                  {filledCards.map((card, cardIndex) => {
                    const cardNumber = pageIndex * PAGE_SIZE + cardIndex + 1;
                    const cardId = String(cardNumber).padStart(3, '0');
                    return card ?
                    <div
                      key={`card-${pageIndex}-${cardIndex}`}
                      className={`print-card-wrap ${showCutGuides ? 'print-cut-guides' : ''}`}>
                      {(normalizedTitle || normalizedSetLabel || showCardIds) &&
                      <div className="print-card-meta">
                        <div className="print-card-title">
                          {normalizedTitle &&
                          <span className="print-card-event">{normalizedTitle}</span>
                          }
                          {normalizedSetLabel &&
                          <span className="print-card-tag">{normalizedSetLabel}</span>
                          }
                        </div>
                        {showCardIds &&
                        <span className="print-card-id">Card {cardId}</span>
                        }
                      </div>
                      }
                      <CardGrid
                        card={card}
                        className="print-card print-card-grid"
                      />
                      {showNameLine &&
                      <div className="print-card-name">
                        <span className="print-card-name-label">Player</span>
                        <span className="print-card-name-line" />
                      </div>
                      }
                    </div> :
                    <div
                      key={`empty-${pageIndex}-${cardIndex}`}
                      className="rounded-2xl border border-white/10 bg-white/[0.02] opacity-0" />;
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
