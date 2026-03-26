import { CellValue, Digit, NumericBoard } from '../types/game';
import { BOX_COLS, BOX_ROWS, DIGITS, SIZE } from './sudoku';

const hasDuplicates = (values: CellValue[]): boolean => {
  const seen = new Set<number>();
  for (const value of values) {
    if (value === null) continue;
    if (seen.has(value)) return true;
    seen.add(value);
  }
  return false;
};

export const isValidPlacement = (
  board: NumericBoard,
  row: number,
  col: number,
  value: Digit
): boolean => {
  for (let c = 0; c < SIZE; c += 1) {
    if (c !== col && board[row][c] === value) return false;
  }

  for (let r = 0; r < SIZE; r += 1) {
    if (r !== row && board[r][col] === value) return false;
  }

  const startRow = Math.floor(row / BOX_ROWS) * BOX_ROWS;
  const startCol = Math.floor(col / BOX_COLS) * BOX_COLS;
  for (let r = startRow; r < startRow + BOX_ROWS; r += 1) {
    for (let c = startCol; c < startCol + BOX_COLS; c += 1) {
      if ((r !== row || c !== col) && board[r][c] === value) return false;
    }
  }

  return true;
};

export const getCandidates = (board: NumericBoard, row: number, col: number): Digit[] => {
  if (board[row][col] !== null) return [];
  return DIGITS.filter((d) => isValidPlacement(board, row, col, d));
};

export const getConflictMap = (board: NumericBoard): boolean[][] => {
  const conflicts = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));

  for (let r = 0; r < SIZE; r += 1) {
    const rowValues = board[r];
    if (hasDuplicates(rowValues)) {
      rowValues.forEach((v, c) => {
        if (v === null) return;
        if (rowValues.filter((x) => x === v).length > 1) conflicts[r][c] = true;
      });
    }
  }

  for (let c = 0; c < SIZE; c += 1) {
    const colValues = Array.from({ length: SIZE }, (_, r) => board[r][c]);
    if (hasDuplicates(colValues)) {
      colValues.forEach((v, r) => {
        if (v === null) return;
        if (colValues.filter((x) => x === v).length > 1) conflicts[r][c] = true;
      });
    }
  }

  for (let sr = 0; sr < SIZE; sr += BOX_ROWS) {
    for (let sc = 0; sc < SIZE; sc += BOX_COLS) {
      const cells: Array<{ r: number; c: number; value: CellValue }> = [];
      for (let r = sr; r < sr + BOX_ROWS; r += 1) {
        for (let c = sc; c < sc + BOX_COLS; c += 1) {
          cells.push({ r, c, value: board[r][c] });
        }
      }
      const vals = cells.map((cell) => cell.value);
      if (hasDuplicates(vals)) {
        cells.forEach((cell) => {
          if (cell.value === null) return;
          if (vals.filter((x) => x === cell.value).length > 1) {
            conflicts[cell.r][cell.c] = true;
          }
        });
      }
    }
  }

  return conflicts;
};

export const isBoardComplete = (board: NumericBoard): boolean =>
  board.every((row) => row.every((v) => v !== null));

export const isBoardValid = (board: NumericBoard): boolean => {
  for (let i = 0; i < SIZE; i += 1) {
    const row = board[i];
    if (row.some((v) => v === null) || new Set(row).size !== SIZE) return false;

    const col = Array.from({ length: SIZE }, (_, r) => board[r][i]);
    if (col.some((v) => v === null) || new Set(col).size !== SIZE) return false;
  }

  for (let sr = 0; sr < SIZE; sr += BOX_ROWS) {
    for (let sc = 0; sc < SIZE; sc += BOX_COLS) {
      const box: CellValue[] = [];
      for (let r = sr; r < sr + BOX_ROWS; r += 1) {
        for (let c = sc; c < sc + BOX_COLS; c += 1) {
          box.push(board[r][c]);
        }
      }
      if (box.some((v) => v === null) || new Set(box).size !== SIZE) return false;
    }
  }

  return true;
};
