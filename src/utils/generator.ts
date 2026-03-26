import { Difficulty, NumericBoard, Puzzle } from '../types/game';
import { cloneNumericBoard, createEmptyNumericBoard, DIGITS, shuffle, SIZE } from './sudoku';
import { countSolutions } from './solver';
import { getCandidates, isValidPlacement } from './validation';

const removalTarget: Record<Difficulty, number> = {
  easy: 14,
  medium: 18,
  hard: 22,
};

const fillBoard = (board: NumericBoard): boolean => {
  let bestCell: { row: number; col: number; candidates: number[] } | null = null;

  for (let r = 0; r < SIZE; r += 1) {
    for (let c = 0; c < SIZE; c += 1) {
      if (board[r][c] !== null) continue;
      const candidates = getCandidates(board, r, c);
      if (candidates.length === 0) return false;
      if (!bestCell || candidates.length < bestCell.candidates.length) {
        bestCell = { row: r, col: c, candidates };
      }
    }
  }

  if (!bestCell) return true;

  for (const value of shuffle(bestCell.candidates)) {
    if (!isValidPlacement(board, bestCell.row, bestCell.col, value as Digit)) continue;
    board[bestCell.row][bestCell.col] = value as Digit;
    if (fillBoard(board)) return true;
    board[bestCell.row][bestCell.col] = null;
  }

  return false;
};

export const generateSolvedBoard = (): NumericBoard => {
  const board = createEmptyNumericBoard();
  const firstRow = shuffle(DIGITS);
  for (let c = 0; c < SIZE; c += 1) {
    board[0][c] = firstRow[c];
  }
  fillBoard(board);
  return board;
};

export const createPuzzleFromSolution = (solution: NumericBoard, difficulty: Difficulty): NumericBoard => {
  const puzzle = cloneNumericBoard(solution);
  const cells = shuffle(Array.from({ length: SIZE * SIZE }, (_, idx) => idx));
  const target = removalTarget[difficulty];
  let removed = 0;

  for (const index of cells) {
    if (removed >= target) break;
    const row = Math.floor(index / SIZE);
    const col = index % SIZE;
    const backup = puzzle[row][col];
    if (backup === null) continue;

    puzzle[row][col] = null;
    const solutions = countSolutions(puzzle, 2);
    if (solutions !== 1) {
      puzzle[row][col] = backup;
    } else {
      removed += 1;
    }
  }

  return puzzle;
};

export const generatePuzzle = (difficulty: Difficulty): Puzzle => {
  const solution = generateSolvedBoard();
  const puzzle = createPuzzleFromSolution(solution, difficulty);
  return {
    id: `${difficulty}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    difficulty,
    puzzle,
    solution,
    createdAt: Date.now(),
  };
};
