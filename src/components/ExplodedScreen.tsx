import { motion } from "framer-motion";

export function ExplodedScreen({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="text-7xl"
        animate={{ scale: [1, 1.3, 1], rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        💥
      </motion.div>
      <h2 className="font-display text-3xl sm:text-4xl text-warning glow-warning tracking-wider animate-pulse-warning">
        IMPACT
      </h2>
      <p className="text-muted-foreground text-sm font-display tracking-wider">
        MISSION FAILED
      </p>
      <button
        onClick={onReset}
        className="mt-4 px-6 h-10 rounded-md border border-border text-muted-foreground font-display tracking-wider text-xs hover:bg-muted active:scale-[0.98] transition-all"
      >
        RESET
      </button>
    </motion.div>
  );
}
