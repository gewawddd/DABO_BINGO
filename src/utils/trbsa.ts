export const LETTERS = ['T', 'R', 'B', 'S', 'A'] as const;
export type TrbsaLetter = (typeof LETTERS)[number];
export type CardCell = number | 'FREE';
export type TrbsaCard = CardCell[][];

export const LETTER_COLOR: Record<TrbsaLetter, 'blue' | 'red'> = {
  T: 'blue',
  R: 'red',
  B: 'blue',
  S: 'red',
  A: 'blue'
};

export function getLetterForNumber(n: number): TrbsaLetter {
  if (n <= 15) return 'T';
  if (n <= 30) return 'R';
  if (n <= 45) return 'B';
  if (n <= 60) return 'S';
  return 'A';
}

export function formatCall(n: number): string {
  return `${getLetterForNumber(n)}-${n}`;
}

export function createShuffledDeck(): number[] {
  const deck = Array.from({ length: 75 }, (_, i) => i + 1);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

/** Build a random 5x5 TRBSA card (columns = T,R,B,S,A) with FREE SPACE at center. */
export function createRandomCard(): TrbsaCard {
  // columns: each column draws from its letter's range, 5 unique numbers
  const ranges: Record<TrbsaLetter, [number, number]> = {
    T: [1, 15],
    R: [16, 30],
    B: [31, 45],
    S: [46, 60],
    A: [61, 75]
  };
  const cols: (number | 'FREE')[][] = LETTERS.map((l) => {
    const [lo, hi] = ranges[l];
    const pool: number[] = [];
    for (let i = lo; i <= hi; i++) pool.push(i);
    // shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, 5);
  });
  // free space at center column (B), row 2 (0-indexed)
  cols[2][2] = 'FREE';
  // transpose so rows[r][c]
  const rows: (number | 'FREE')[][] = [];
  for (let r = 0; r < 5; r++) {
    const row: (number | 'FREE')[] = [];
    for (let c = 0; c < 5; c++) row.push(cols[c][r]);
    rows.push(row);
  }
  return rows;
}

const COLUMN_RANGES: Array<[number, number]> = [
  [1, 15],
  [16, 30],
  [31, 45],
  [46, 60],
  [61, 75]
];

export function isTrbsaCard(value: unknown): value is TrbsaCard {
  if (!Array.isArray(value) || value.length !== 5) return false;
  const seenNumbers = new Set<number>();
  for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
    const row = value[rowIndex];
    if (!Array.isArray(row) || row.length !== 5) return false;
    for (let colIndex = 0; colIndex < 5; colIndex++) {
      const cell = row[colIndex];
      if (cell === 'FREE') {
        if (rowIndex !== 2 || colIndex !== 2) return false;
        continue;
      }
      if (typeof cell !== 'number' || !Number.isInteger(cell)) return false;
      const [lo, hi] = COLUMN_RANGES[colIndex];
      if (cell < lo || cell > hi) return false;
      if (seenNumbers.has(cell)) return false;
      seenNumbers.add(cell);
    }
  }
  return true;
}

export function serializeCard(card: TrbsaCard): string {
  return card.flat().join('-');
}

export function createUniqueCards(count: number): TrbsaCard[] {
  const cards: TrbsaCard[] = [];
  const seen = new Set<string>();
  let attempts = 0;
  const maxAttempts = Math.max(200, count * 120);
  while (cards.length < count && attempts < maxAttempts) {
    const card = createRandomCard();
    const key = serializeCard(card);
    if (!seen.has(key)) {
      seen.add(key);
      cards.push(card);
    }
    attempts += 1;
  }
  if (cards.length !== count) {
    throw new Error('Unable to generate unique cards. Try again.');
  }
  return cards;
}