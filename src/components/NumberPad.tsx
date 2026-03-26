import { Digit } from '../types/game';

interface NumberPadProps {
  onDigit: (digit: Digit) => void;
}

export const NumberPad = ({ onDigit }: NumberPadProps) => (
  <div className="grid grid-cols-3 gap-2">
    {[1, 2, 3, 4, 5, 6].map((n) => (
      <button
        key={n}
        type="button"
        onClick={() => onDigit(n as Digit)}
        className="rounded-xl border border-white/15 bg-brand-panel px-4 py-3 text-xl font-bold text-brand-text transition hover:scale-[1.02] hover:border-brand-accent"
        aria-label={`Enter number ${n}`}
      >
        {n}
      </button>
    ))}
  </div>
);
