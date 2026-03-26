import { PersistedGame, Stats } from '../types/game';

const GAME_KEY = 'mini-sudoku.game.v1';
const STATS_KEY = 'mini-sudoku.stats.v1';
const SETTINGS_KEY = 'mini-sudoku.settings.v1';

export interface Settings {
  theme: 'dark' | 'light';
  soundEnabled: boolean;
}

export const defaultStats: Stats = {
  gamesPlayed: 0,
  gamesWon: 0,
  bestTimeByDifficulty: {},
  streak: 0,
  lastWonDate: null,
};

export const defaultSettings: Settings = {
  theme: 'dark',
  soundEnabled: false,
};

const safeRead = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const loadGame = (): PersistedGame | null => safeRead<PersistedGame | null>(GAME_KEY, null);
export const saveGame = (game: PersistedGame): void => localStorage.setItem(GAME_KEY, JSON.stringify(game));
export const clearGame = (): void => localStorage.removeItem(GAME_KEY);

export const loadStats = (): Stats => safeRead<Stats>(STATS_KEY, defaultStats);
export const saveStats = (stats: Stats): void => localStorage.setItem(STATS_KEY, JSON.stringify(stats));

export const loadSettings = (): Settings => safeRead<Settings>(SETTINGS_KEY, defaultSettings);
export const saveSettings = (settings: Settings): void =>
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
