import { useEffect, useMemo } from 'react';
import { Controls } from './components/Controls';
import { GameBoard } from './components/GameBoard';
import { Header } from './components/Header';
import { NumberPad } from './components/NumberPad';
import { StatsBar } from './components/StatsBar';
import { VictoryModal } from './components/VictoryModal';
import { useGame } from './hooks/useGame';
import { Digit } from './types/game';
import { SIZE } from './utils/sudoku';

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

function App() {
  const {
    board,
    puzzle,
    stats,
    elapsed,
    paused,
    notesMode,
    completed,
    selected,
    difficulty,
    hintMessage,
    showMistakes,
    highlightedKeys,
    setSelected,
    setDifficulty,
    setPaused,
    setNotesMode,
    startNewGame,
    restartPuzzle,
    applyDigit,
    clearSelected,
    requestHint,
    checkBoard,
    toggleMistakes,
  } = useGame();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (!board.length) return;

      if (event.key >= '1' && event.key <= '6') {
        applyDigit(Number(event.key) as Digit);
        return;
      }

      if (event.key === 'Backspace' || event.key === 'Delete') {
        clearSelected();
        return;
      }

      if (!selected) return;

      const move = (dr: number, dc: number): void => {
        event.preventDefault();
        const row = (selected.row + dr + SIZE) % SIZE;
        const col = (selected.col + dc + SIZE) % SIZE;
        setSelected({ row, col });
      };

      if (event.key === 'ArrowUp') move(-1, 0);
      else if (event.key === 'ArrowDown') move(1, 0);
      else if (event.key === 'ArrowLeft') move(0, -1);
      else if (event.key === 'ArrowRight') move(0, 1);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [applyDigit, board.length, clearSelected, selected, setSelected]);

  const hasActiveGame = Boolean(puzzle && !completed);

  const subtitle = useMemo(
    () =>
      paused
        ? 'Paused'
        : completed
          ? 'Completed'
          : puzzle
            ? `${difficulty.toUpperCase()} · Live`
            : 'No active puzzle',
    [completed, difficulty, paused, puzzle]
  );

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl space-y-4 p-4 text-brand-text sm:p-6">
      <Header
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        onNewGame={() => startNewGame(difficulty)}
        onContinue={() => setPaused(false)}
        hasActiveGame={hasActiveGame}
      />

      <StatsBar stats={stats} difficulty={difficulty} />

      <section className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <article className="space-y-3 rounded-3xl border border-white/10 bg-brand-panel/60 p-4">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-brand-panelSoft px-3 py-1 text-xs font-semibold text-brand-muted">
              {subtitle}
            </span>
            <span className="rounded-full bg-brand-violet/20 px-3 py-1 text-sm font-bold text-brand-text">
              ⏱ {formatTime(elapsed)}
            </span>
          </div>

          <GameBoard
            board={board}
            selected={selected}
            highlightedKeys={highlightedKeys}
            onSelectCell={setSelected}
            completed={completed}
          />

          {hintMessage && <p className="rounded-xl bg-white/5 p-2 text-sm text-brand-muted">{hintMessage}</p>}
        </article>

        <aside className="space-y-3 rounded-3xl border border-white/10 bg-brand-panel/60 p-4">
          <NumberPad onDigit={applyDigit} />
          <Controls
            notesMode={notesMode}
            paused={paused}
            showMistakes={showMistakes}
            onToggleNotes={() => setNotesMode((v) => !v)}
            onClear={clearSelected}
            onHint={requestHint}
            onCheck={checkBoard}
            onRestart={restartPuzzle}
            onNewGame={() => startNewGame(difficulty)}
            onTogglePause={() => setPaused((v) => !v)}
            onToggleMistakes={toggleMistakes}
          />

          <article className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-3 text-sm text-brand-muted">
            <h3 className="font-semibold text-brand-text">Daily Challenge</h3>
            <p className="mt-1">Seeded challenge placeholder ready for v2 cloud sync.</p>
          </article>
        </aside>
      </section>

      <VictoryModal open={completed} elapsed={elapsed} onPlayAgain={() => startNewGame(difficulty)} />
    </main>
  );
}

export default App;
