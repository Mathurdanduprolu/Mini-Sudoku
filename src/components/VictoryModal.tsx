import { motion } from 'framer-motion';

interface VictoryModalProps {
  open: boolean;
  elapsed: number;
  onPlayAgain: () => void;
}

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

export const VictoryModal = ({ open, elapsed, onPlayAgain }: VictoryModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-brand-bg/70 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-sm rounded-3xl border border-brand-emerald/40 bg-brand-panel p-6 text-center shadow-glow"
      >
        <h2 className="bg-gradient-to-r from-brand-emerald to-brand-accent bg-clip-text text-3xl font-black text-transparent">
          Puzzle Complete!
        </h2>
        <p className="mt-3 text-brand-muted">Brilliant solve. Final time:</p>
        <p className="mt-1 text-3xl font-bold text-brand-emerald">{formatTime(elapsed)}</p>
        <button
          type="button"
          onClick={onPlayAgain}
          className="mt-5 rounded-xl bg-gradient-to-r from-brand-accent to-brand-violet px-4 py-2 font-semibold text-brand-bg"
        >
          Play Again
        </button>
      </motion.div>
    </div>
  );
};
