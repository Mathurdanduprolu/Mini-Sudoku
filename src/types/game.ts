export type Digit = 1 | 2 | 3 | 4 | 5 | 6;
export type CellValue = Digit | null;
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Position {
  row: number;
  col: number;
}

export interface Cell {
  row: number;
  col: number;
  value: CellValue;
  given: boolean;
  notes: Digit[];
  conflicts: boolean;
}

export type Board = Cell[][];
export type NumericBoard = CellValue[][];

export interface Puzzle {
  id: string;
  difficulty: Difficulty;
  puzzle: NumericBoard;
  solution: NumericBoard;
  createdAt: number;
}

export type CandidateMap = Record<string, Digit[]>;

export interface Stats {
  gamesPlayed: number;
  gamesWon: number;
  bestTimeByDifficulty: Partial<Record<Difficulty, number>>;
  streak: number;
  lastWonDate: string | null;
}

export interface PersistedGame {
  puzzle: Puzzle;
  board: NumericBoard;
  selected: Position | null;
  elapsed: number;
  paused: boolean;
  notesMode: boolean;
  showMistakes: boolean;
}

export interface HintResult {
  position: Position;
  value: Digit;
  reason: 'single-candidate' | 'solution-candidate';
}
