import { useState } from "react";
import { motion } from "framer-motion";

interface AdminPanelProps {
  currentTime: number;
  currentPin: string;
  onSave: (timeSeconds: number, pin: string) => void;
  onStart: () => void;
  onReset: () => void;
  onBack: () => void;
  isRunning: boolean;
  getShareUrl: (autoStart: boolean) => string;
}

export function AdminPanel({ currentTime, currentPin, onSave, onStart, onReset, onBack, isRunning }: AdminPanelProps) {
  const [minutes, setMinutes] = useState(Math.floor(currentTime / 60).toString());
  const [seconds, setSeconds] = useState((currentTime % 60).toString());
  const [pin, setPin] = useState(currentPin);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const totalSeconds = parseInt(minutes || "0") * 60 + parseInt(seconds || "0");
    if (totalSeconds > 0 && pin.length === 10) {
      onSave(totalSeconds, pin);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center gap-6 w-full max-w-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="font-display text-xl tracking-wider text-primary">ADMIN CONTROL</h2>

      <div className="w-full space-y-4">
        <div>
          <label className="text-xs font-display tracking-widest text-muted-foreground uppercase block mb-2">
            Countdown Duration
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              className="w-20 h-12 bg-card border border-border rounded-md text-center font-mono-tactical text-lg text-foreground focus:border-primary focus:outline-none"
              placeholder="Min"
              min="0"
            />
            <span className="text-muted-foreground font-mono-tactical">:</span>
            <input
              type="number"
              value={seconds}
              onChange={(e) => setSeconds(e.target.value)}
              className="w-20 h-12 bg-card border border-border rounded-md text-center font-mono-tactical text-lg text-foreground focus:border-primary focus:outline-none"
              placeholder="Sec"
              min="0"
              max="59"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-display tracking-widest text-muted-foreground uppercase block mb-2">
            Defuse Pin (10 digits)
          </label>
          <input
            type="text"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 10))}
            className="w-full h-12 bg-card border border-border rounded-md text-center font-mono-tactical text-lg tracking-[0.3em] text-foreground focus:border-primary focus:outline-none"
            placeholder="0000000000"
            maxLength={10}
          />
          <p className="text-xs text-muted-foreground mt-1 text-center">{pin.length}/10 digits</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <button
          onClick={handleSave}
          disabled={pin.length !== 10}
          className="w-full h-12 rounded-md bg-primary text-primary-foreground font-display tracking-wider text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40"
        >
          {saved ? "✓ SAVED" : "SAVE SETTINGS"}
        </button>

        {!isRunning ? (
          <button
            onClick={onStart}
            className="w-full h-12 rounded-md bg-destructive text-destructive-foreground font-display tracking-wider text-sm hover:opacity-90 active:scale-[0.98] transition-all"
          >
            ▶ LAUNCH MISSILE
          </button>
        ) : (
          <button
            onClick={onReset}
            className="w-full h-12 rounded-md border border-border text-muted-foreground font-display tracking-wider text-sm hover:bg-muted active:scale-[0.98] transition-all"
          >
            ■ STOP TIMER
          </button>
        )}

        <button
          onClick={onBack}
          className="w-full h-10 rounded-md border border-border text-muted-foreground font-display tracking-wider text-xs hover:bg-muted active:scale-[0.98] transition-all mt-2"
        >
          ← BACK TO MAIN
        </button>
      </div>
    </motion.div>
  );
}
