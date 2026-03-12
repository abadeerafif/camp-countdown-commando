import { motion } from "framer-motion";

export function DefusedScreen({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-6"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", duration: 0.6 }}
    >
      <motion.div
        className="w-24 h-24 rounded-full border-4 border-safe flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        <span className="text-4xl">✓</span>
      </motion.div>
      <h2 className="font-display text-3xl sm:text-4xl text-safe glow-safe tracking-wider">
        MISSILE DEFUSED
      </h2>
      <p className="text-muted-foreground text-sm font-display tracking-wider">
        THREAT NEUTRALIZED
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
