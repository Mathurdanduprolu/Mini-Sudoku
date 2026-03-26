import { Difficulty } from '../types/game';

interface HeaderProps {
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onNewGame: () => void;
  onContinue: () => void;
  hasActiveGame: boolean;
}

const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

export const Header = ({
  difficulty,
  onDifficultyChange,
  onNewGame,
  onContinue,
  hasActiveGame,
}: HeaderProps) => (
  <header className="rounded-3xl border border-white/10 bg-brand-panel/70 bg-gridGlow p-5 shadow-glow backdrop-blur">
    <div className="mb-4">
      <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Mini Sudoku</h1>
      <p className="mt-1 text-sm text-brand-muted">A polished 1–6 logic challenge with premium feel.</p>
    </div>

    <div className="mb-4 flex flex-wrap gap-2">
      {difficulties.map((chip) => (
        <button
          key={chip}
          type="button"
          aria-label={`Set difficulty ${chip}`}
          onClick={() => onDifficultyChange(chip)}
          className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
            difficulty === chip
              ? 'bg-brand-accent text-brand-bg'
              : 'bg-white/10 text-brand-text hover:bg-white/20'
          }`}
        >
          {chip}
        </button>
      ))}
    </div>

    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={onNewGame}
        className="rounded-xl bg-gradient-to-r from-brand-accent to-brand-violet px-4 py-2 font-semibold text-brand-bg shadow-lg shadow-cyan-500/20 transition hover:scale-[1.02]"
      >
        New Game
      </button>
      <button
        type="button"
        onClick={onContinue}
        disabled={!hasActiveGame}
        className="rounded-xl border border-white/20 px-4 py-2 font-semibold transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continue
      </button>
    </div>
  </header>
);
