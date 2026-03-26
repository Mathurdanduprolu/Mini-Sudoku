import { Difficulty, Stats } from '../types/game';

interface StatsBarProps {
  stats: Stats;
  difficulty: Difficulty;
}

const toTime = (seconds?: number): string => {
  if (seconds === undefined) return '--:--';
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

export const StatsBar = ({ stats, difficulty }: StatsBarProps) => {
  const items = [
    { label: 'Played', value: stats.gamesPlayed },
    { label: 'Won', value: stats.gamesWon },
    { label: 'Best Time', value: toTime(stats.bestTimeByDifficulty[difficulty]) },
    { label: 'Streak', value: stats.streak },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-4" aria-label="Game statistics">
      {items.map((item) => (
        <article key={item.label} className="rounded-2xl border border-white/10 bg-brand-panelSoft/80 p-3">
          <p className="text-xs uppercase text-brand-muted">{item.label}</p>
          <p className="mt-1 text-xl font-bold">{item.value}</p>
        </article>
      ))}
    </section>
  );
};
