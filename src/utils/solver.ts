import { CellValue, Digit, NumericBoard } from '../types/game';
import { cloneNumericBoard, shuffle, SIZE } from './sudoku';
import { getCandidates, isValidPlacement } from './validation';

interface NextCell {
  row: number;
  col: number;
  candidates: number[];
}

const findBestCell = (board: NumericBoard): NextCell | null => {
  let best: NextCell | null = null;

  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      if (board[row][col] !== null) continue;
      const candidates = getCandidates(board, row, col);
      if (candidates.length === 0) return { row, col, candidates };
      if (!best || candidates.length < best.candidates.length) {
        best = { row, col, candidates };
      }
    }
  }

  return best;
};

export const solveBoard = (input: NumericBoard): NumericBoard | null => {
  const board = cloneNumericBoard(input);

  const solve = (): boolean => {
    const next = findBestCell(board);
    if (!next) return true;
    if (next.candidates.length === 0) return false;

    for (const candidate of shuffle(next.candidates)) {
      if (!isValidPlacement(board, next.row, next.col, candidate as Digit)) continue;
      board[next.row][next.col] = candidate as CellValue;
      if (solve()) return true;
      board[next.row][next.col] = null;
    }

    return false;
  };

  return solve() ? board : null;
};

export const countSolutions = (input: NumericBoard, limit = 2): number => {
  const board = cloneNumericBoard(input);
  let count = 0;

  const dfs = (): void => {
    if (count >= limit) return;
    const next = findBestCell(board);
    if (!next) {
      count += 1;
      return;
    }
    if (next.candidates.length === 0) return;

    for (const candidate of next.candidates) {
      board[next.row][next.col] = candidate as CellValue;
      dfs();
      board[next.row][next.col] = null;
      if (count >= limit) return;
    }
  };

  dfs();
  return count;
};
