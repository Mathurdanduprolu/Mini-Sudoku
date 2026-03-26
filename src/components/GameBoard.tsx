import { Board, Position } from '../types/game';
import { posKey, SIZE } from '../utils/sudoku';
import { Cell } from './Cell';

interface GameBoardProps {
  board: Board;
  selected: Position | null;
  highlightedKeys: Set<string>;
  onSelectCell: (pos: Position) => void;
  completed: boolean;
}

export const GameBoard = ({
  board,
  selected,
  highlightedKeys,
  onSelectCell,
  completed,
}: GameBoardProps) => {
  if (!board.length) {
    return (
      <div className="rounded-3xl border border-dashed border-white/20 bg-brand-panel p-8 text-center text-brand-muted">
        Start a new puzzle to begin.
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-6 gap-1 rounded-2xl border border-white/20 bg-brand-panelSoft p-2 shadow-glow ${
        completed ? 'win-pulse' : ''
      }`}
      role="grid"
      aria-label="Mini Sudoku board"
    >
      {board.flat().map((cell) => {
        const boxTop = cell.row % 2 === 0;
        const boxLeft = cell.col % 3 === 0;
        const boxBottom = cell.row === SIZE - 1 || cell.row % 2 === 1;
        const boxRight = cell.col === SIZE - 1 || cell.col % 3 === 2;

        return (
          <div
            key={posKey(cell)}
            className={`p-[1px] ${boxTop ? 'border-t-2 border-t-brand-accent/60' : ''} ${
              boxLeft ? 'border-l-2 border-l-brand-accent/60' : ''
            } ${boxBottom ? 'border-b-2 border-b-brand-accent/60' : ''} ${
              boxRight ? 'border-r-2 border-r-brand-accent/60' : ''
            }`}
          >
            <Cell
              cell={cell}
              selected={Boolean(selected && selected.row === cell.row && selected.col === cell.col)}
              highlighted={highlightedKeys.has(posKey(cell))}
              onSelect={() => onSelectCell({ row: cell.row, col: cell.col })}
            />
          </div>
        );
      })}
    </div>
  );
};
