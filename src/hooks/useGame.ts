import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Board,
  Difficulty,
  Digit,
  PersistedGame,
  Position,
  Puzzle,
  Stats,
} from '../types/game';
import { generatePuzzle } from '../utils/generator';
import { getHint } from '../utils/hints';
import { clearGame, defaultStats, loadGame, loadStats, saveGame, saveStats } from '../utils/storage';
import { boardToNumeric, cloneNumericBoard, posKey, toCellBoard } from '../utils/sudoku';
import { getConflictMap, isBoardComplete, isBoardValid } from '../utils/validation';
import { useTimer } from './useTimer';

const formatDate = (ts: number): string => new Date(ts).toISOString().slice(0, 10);

export const useGame = () => {
  const [stats, setStats] = useState<Stats>(defaultStats);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [board, setBoard] = useState<Board>([]);
  const [selected, setSelected] = useState<Position | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [notesMode, setNotesMode] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showMistakes, setShowMistakes] = useState(true);
  const [hintMessage, setHintMessage] = useState('');

  useEffect(() => {
    setStats(loadStats());
    const persisted = loadGame();
    if (!persisted) return;
    setPuzzle(persisted.puzzle);
    setDifficulty(persisted.puzzle.difficulty);
    setBoard(toCellBoard(persisted.board, persisted.puzzle.puzzle));
    setSelected(persisted.selected);
    setElapsed(persisted.elapsed);
    setPaused(persisted.paused);
    setNotesMode(persisted.notesMode);
    setShowMistakes(persisted.showMistakes);
  }, []);

  const persistGame = useCallback(() => {
    if (!puzzle || !board.length || completed) return;
    const payload: PersistedGame = {
      puzzle,
      board: boardToNumeric(board),
      selected,
      elapsed,
      paused,
      notesMode,
      showMistakes,
    };
    saveGame(payload);
  }, [board, completed, elapsed, notesMode, paused, puzzle, selected, showMistakes]);

  useEffect(() => {
    persistGame();
  }, [persistGame]);

  const recalcConflicts = useCallback((next: Board): Board => {
    const conflictMap = getConflictMap(boardToNumeric(next));
    return next.map((row, r) =>
      row.map((cell, c) => ({
        ...cell,
        conflicts: showMistakes ? conflictMap[r][c] : false,
      }))
    );
  }, [showMistakes]);

  const startNewGame = useCallback((newDifficulty: Difficulty = difficulty) => {
    const nextPuzzle = generatePuzzle(newDifficulty);
    setPuzzle(nextPuzzle);
    setDifficulty(newDifficulty);
    setBoard(recalcConflicts(toCellBoard(nextPuzzle.puzzle, nextPuzzle.puzzle)));
    setSelected(null);
    setElapsed(0);
    setPaused(false);
    setCompleted(false);
    setHintMessage('');

    setStats((prev) => {
      const next = { ...prev, gamesPlayed: prev.gamesPlayed + 1 };
      saveStats(next);
      return next;
    });
  }, [difficulty, recalcConflicts]);

  const restartPuzzle = useCallback(() => {
    if (!puzzle) return;
    setBoard(recalcConflicts(toCellBoard(cloneNumericBoard(puzzle.puzzle), puzzle.puzzle)));
    setElapsed(0);
    setPaused(false);
    setCompleted(false);
    setHintMessage('');
  }, [puzzle, recalcConflicts]);

  const winGame = useCallback(() => {
    if (!puzzle) return;
    setCompleted(true);
    setPaused(true);
    clearGame();
    setStats((prev) => {
      const day = formatDate(Date.now());
      const continued = prev.lastWonDate === day;
      const best = prev.bestTimeByDifficulty[puzzle.difficulty];
      const bestTimeByDifficulty = {
        ...prev.bestTimeByDifficulty,
        [puzzle.difficulty]: best === undefined ? elapsed : Math.min(best, elapsed),
      };
      const next = {
        ...prev,
        gamesWon: prev.gamesWon + 1,
        streak: continued ? prev.streak : prev.streak + 1,
        lastWonDate: day,
        bestTimeByDifficulty,
      };
      saveStats(next);
      return next;
    });
  }, [elapsed, puzzle]);

  const applyDigit = useCallback((digit: Digit) => {
    if (!selected || !puzzle || paused || completed) return;

    setBoard((prev) => {
      const next = prev.map((row) => row.map((cell) => ({ ...cell })));
      const cell = next[selected.row][selected.col];
      if (cell.given) return prev;

      if (notesMode) {
        const has = cell.notes.includes(digit);
        cell.notes = has ? cell.notes.filter((d) => d !== digit) : [...cell.notes, digit].sort();
      } else {
        cell.value = digit;
        cell.notes = [];
      }

      const withConflicts = recalcConflicts(next);
      const numeric = boardToNumeric(withConflicts);
      if (isBoardComplete(numeric) && isBoardValid(numeric)) {
        queueMicrotask(winGame);
      }
      return withConflicts;
    });
  }, [completed, notesMode, paused, puzzle, recalcConflicts, selected, winGame]);

  const clearSelected = useCallback(() => {
    if (!selected || paused || completed) return;
    setBoard((prev) => {
      const next = prev.map((row) => row.map((cell) => ({ ...cell })));
      const cell = next[selected.row][selected.col];
      if (cell.given) return prev;
      cell.value = null;
      cell.notes = [];
      return recalcConflicts(next);
    });
  }, [completed, paused, recalcConflicts, selected]);

  const checkBoard = useCallback(() => {
    if (!board.length) return;
    const numeric = boardToNumeric(board);
    if (isBoardComplete(numeric) && isBoardValid(numeric)) {
      setHintMessage('Perfect board. Puzzle solved!');
      if (!completed) winGame();
      return;
    }
    setHintMessage('Not solved yet. Review highlighted conflicts.');
  }, [board, completed, winGame]);

  const requestHint = useCallback(() => {
    if (!puzzle || !board.length) return;
    const numeric = boardToNumeric(board);
    const hint = getHint(numeric, puzzle.solution, selected);
    if (!hint) {
      setHintMessage('No hint available.');
      return;
    }
    setSelected(hint.position);
    setHintMessage(
      hint.reason === 'single-candidate'
        ? `Single candidate found: ${hint.value}`
        : `Try ${hint.value} at row ${hint.position.row + 1}, col ${hint.position.col + 1}`
    );
  }, [board, puzzle, selected]);

  const toggleMistakes = useCallback(() => {
    setShowMistakes((prev) => !prev);
  }, []);

  useEffect(() => {
    setBoard((prev) => (prev.length ? recalcConflicts(prev) : prev));
  }, [recalcConflicts]);

  useTimer(Boolean(puzzle) && !paused && !completed, () => setElapsed((t) => t + 1));

  const selectedValue = useMemo(() => {
    if (!selected || !board.length) return null;
    return board[selected.row][selected.col].value;
  }, [board, selected]);

  const highlightedKeys = useMemo(() => {
    if (!selected || !board.length) return new Set<string>();
    const keys = new Set<string>();
    const sel = board[selected.row][selected.col];
    for (const row of board) {
      for (const cell of row) {
        const related =
          cell.row === selected.row ||
          cell.col === selected.col ||
          (Math.floor(cell.row / 2) === Math.floor(selected.row / 2) &&
            Math.floor(cell.col / 3) === Math.floor(selected.col / 3));
        const same = sel.value !== null && cell.value === sel.value;
        if (related || same) keys.add(posKey(cell));
      }
    }
    return keys;
  }, [board, selected]);

  return {
    board,
    puzzle,
    stats,
    elapsed,
    paused,
    notesMode,
    completed,
    selected,
    selectedValue,
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
  };
};
