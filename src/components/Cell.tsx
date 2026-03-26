import { Cell as CellType } from '../types/game';

interface CellProps {
  cell: CellType;
  selected: boolean;
  highlighted: boolean;
  onSelect: () => void;
}

export const Cell = ({ cell, selected, highlighted, onSelect }: CellProps) => {
  const base = 'aspect-square w-full rounded-md border text-lg font-bold transition sm:text-2xl';
  const state = cell.given
    ? 'border-white/10 bg-white/10 text-white'
    : 'border-white/10 bg-brand-panel text-brand-accent hover:bg-brand-panelSoft';
  const selectedClass = selected ? 'ring-2 ring-brand-accent' : '';
  const highlight = highlighted && !selected ? 'bg-brand-violet/20' : '';
  const conflict = cell.conflicts ? 'border-brand-coral bg-brand-coral/15 text-brand-coral' : '';

  return (
    <button
      type="button"
      aria-label={`Row ${cell.row + 1} column ${cell.col + 1}`}
      className={[base, state, selectedClass, highlight, conflict].join(' ')}
      onClick={onSelect}
    >
      {cell.value ?? ''}
      {!cell.value && cell.notes.length > 0 && (
        <span className="mt-1 block text-[10px] font-medium text-brand-muted">{cell.notes.join(' ')}</span>
      )}
    </button>
  );
};
