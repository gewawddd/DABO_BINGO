export const LETTERS = ['T', 'R', 'B', 'S', 'A'] as const;
export type TrbsaLetter = (typeof LETTERS)[number];

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
export function createRandomCard(): (number | 'FREE')[][] {
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