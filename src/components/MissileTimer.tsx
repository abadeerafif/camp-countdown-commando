import { motion } from "framer-motion";

interface MissileTimerProps {
  timeLeftSeconds: number;
  isRunning: boolean;
}

export function MissileTimer({ timeLeftSeconds, isRunning }: MissileTimerProps) {
  const hours = Math.floor(timeLeftSeconds / 3600);
  const minutes = Math.floor((timeLeftSeconds % 3600) / 60);
  const seconds = timeLeftSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");
  const isUrgent = timeLeftSeconds < 60 && isRunning;

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground font-display">
        Time Until Impact
      </p>
      <motion.div
        className={`font-mono-tactical text-6xl sm:text-8xl tracking-wider ${
          isUrgent ? "text-warning glow-warning animate-pulse-warning" : isRunning ? "text-primary glow-primary" : "text-muted-foreground"
        }`}
        animate={isUrgent ? { scale: [1, 1.02, 1] } : {}}
        transition={{ repeat: Infinity, duration: 0.5 }}
      >
        {pad(hours)}:{pad(minutes)}:{pad(seconds)}
      </motion.div>
      {isRunning && (
        <motion.div
          className="flex items-center gap-2 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className={`w-2 h-2 rounded-full ${isUrgent ? "bg-warning" : "bg-primary"} animate-pulse-warning`} />
          <span className={`text-xs uppercase tracking-widest ${isUrgent ? "text-warning" : "text-primary"}`}>
            {isUrgent ? "CRITICAL" : "MISSILE INBOUND"}
          </span>
        </motion.div>
      )}
    </div>
  );
}
