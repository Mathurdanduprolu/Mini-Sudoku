import { Board, Cell, CellValue, Digit, NumericBoard, Position } from '../types/game';

export const SIZE = 6;
export const BOX_ROWS = 2;
export const BOX_COLS = 3;
export const DIGITS: Digit[] = [1, 2, 3, 4, 5, 6];

export const isDigit = (value: number): value is Digit => DIGITS.includes(value as Digit);

export const createEmptyNumericBoard = (): NumericBoard =>
  Array.from({ length: SIZE }, () => Array<CellValue>(SIZE).fill(null));

export const cloneNumericBoard = (board: NumericBoard): NumericBoard => board.map((row) => [...row]);

export const getBoxIndex = (row: number, col: number): number =>
  Math.floor(row / BOX_ROWS) * (SIZE / BOX_COLS) + Math.floor(col / BOX_COLS);

export const shuffle = <T>(items: T[]): T[] => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const toCellBoard = (numeric: NumericBoard, givens: NumericBoard): Board =>
  numeric.map((row, r) =>
    row.map<Cell>((value, c) => ({
      row: r,
      col: c,
      value,
      given: givens[r][c] !== null,
      notes: [],
      conflicts: false,
    }))
  );

export const boardToNumeric = (board: Board): NumericBoard =>
  board.map((row) => row.map((cell) => cell.value));

export const posKey = ({ row, col }: Position): string => `${row}:${col}`;
