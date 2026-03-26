interface ControlsProps {
  notesMode: boolean;
  paused: boolean;
  showMistakes: boolean;
  onToggleNotes: () => void;
  onClear: () => void;
  onHint: () => void;
  onCheck: () => void;
  onRestart: () => void;
  onNewGame: () => void;
  onTogglePause: () => void;
  onToggleMistakes: () => void;
}

export const Controls = ({
  notesMode,
  paused,
  showMistakes,
  onToggleNotes,
  onClear,
  onHint,
  onCheck,
  onRestart,
  onNewGame,
  onTogglePause,
  onToggleMistakes,
}: ControlsProps) => (
  <div className="grid grid-cols-2 gap-2">
    <button type="button" onClick={onToggleNotes} className={`rounded-xl px-3 py-2 font-semibold ${notesMode ? 'bg-brand-violet text-white' : 'bg-white/10'}`}>
      Notes {notesMode ? 'On' : 'Off'}
    </button>
    <button type="button" onClick={onClear} className="rounded-xl bg-white/10 px-3 py-2 font-semibold">
      Erase
    </button>
    <button type="button" onClick={onHint} className="rounded-xl bg-brand-emerald/20 px-3 py-2 font-semibold text-brand-emerald">
      Hint
    </button>
    <button type="button" onClick={onCheck} className="rounded-xl bg-brand-amber/20 px-3 py-2 font-semibold text-brand-amber">
      Check
    </button>
    <button type="button" onClick={onRestart} className="rounded-xl bg-white/10 px-3 py-2 font-semibold">
      Restart
    </button>
    <button type="button" onClick={onNewGame} className="rounded-xl bg-brand-accent/20 px-3 py-2 font-semibold text-brand-accent">
      New
    </button>
    <button type="button" onClick={onTogglePause} className="rounded-xl bg-white/10 px-3 py-2 font-semibold">
      {paused ? 'Resume' : 'Pause'}
    </button>
    <button
      type="button"
      onClick={onToggleMistakes}
      className={`rounded-xl px-3 py-2 font-semibold ${showMistakes ? 'bg-brand-coral/20 text-brand-coral' : 'bg-white/10'}`}
    >
      Mistakes
    </button>
  </div>
);
