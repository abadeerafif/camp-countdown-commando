import { useState } from "react";
import { motion } from "framer-motion";

interface PinInputProps {
  onSubmit: (pin: string) => void;
  error?: string;
  label: string;
}

export function PinInput({ onSubmit, error, label }: PinInputProps) {
  const [pin, setPin] = useState("");

  const handleKey = (digit: string) => {
    if (pin.length < 10) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 10) {
        setTimeout(() => {
          onSubmit(newPin);
          setPin("");
        }, 200);
      }
    }
  };

  const handleClear = () => setPin("");
  const handleBackspace = () => setPin((p) => p.slice(0, -1));

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground font-display">
        {label}
      </p>

      {/* Pin display */}
      <div className="flex gap-1.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className={`w-7 h-10 sm:w-9 sm:h-12 rounded-sm border flex items-center justify-center font-mono-tactical text-lg sm:text-xl ${
              i < pin.length
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-muted/30 text-muted-foreground"
            }`}
            animate={i === pin.length - 1 ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.15 }}
          >
            {i < pin.length ? "●" : ""}
          </motion.div>
        ))}
      </div>

      {error && (
        <motion.p
          className="text-xs text-warning font-display tracking-wider"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.p>
      )}

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-2 w-fit">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <button
            key={d}
            onClick={() => handleKey(d.toString())}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-md bg-card border border-border font-mono-tactical text-xl text-foreground hover:bg-primary/20 hover:border-primary active:scale-95 transition-all"
          >
            {d}
          </button>
        ))}
        <button
          onClick={handleClear}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-md bg-card border border-border font-display text-xs text-muted-foreground hover:bg-destructive/20 hover:border-destructive active:scale-95 transition-all"
        >
          CLR
        </button>
        <button
          onClick={() => handleKey("0")}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-md bg-card border border-border font-mono-tactical text-xl text-foreground hover:bg-primary/20 hover:border-primary active:scale-95 transition-all"
        >
          0
        </button>
        <button
          onClick={handleBackspace}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-md bg-card border border-border font-display text-xs text-muted-foreground hover:bg-destructive/20 hover:border-destructive active:scale-95 transition-all"
        >
          DEL
        </button>
      </div>
    </div>
  );
}
