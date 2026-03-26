import { HintResult, NumericBoard, Position } from '../types/game';
import { SIZE } from './sudoku';
import { getCandidates } from './validation';

export const getHint = (
  board: NumericBoard,
  solution: NumericBoard,
  selected: Position | null
): HintResult | null => {
  if (selected) {
    const { row, col } = selected;
    if (board[row][col] === null) {
      return {
        position: selected,
        value: solution[row][col]!,
        reason: 'solution-candidate',
      };
    }
  }

  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      if (board[row][col] !== null) continue;
      const candidates = getCandidates(board, row, col);
      if (candidates.length === 1) {
        return {
          position: { row, col },
          value: candidates[0],
          reason: 'single-candidate',
        };
      }
    }
  }

  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      if (board[row][col] === null) {
        return {
          position: { row, col },
          value: solution[row][col]!,
          reason: 'solution-candidate',
        };
      }
    }
  }

  return null;
};
