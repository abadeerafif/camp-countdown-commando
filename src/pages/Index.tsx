import { useState } from "react";
import { motion } from "framer-motion";
import { useGameState } from "@/hooks/useGameState";
import { MissileTimer } from "@/components/MissileTimer";
import { PinInput } from "@/components/PinInput";
import { AdminPanel } from "@/components/AdminPanel";
import { DefusedScreen } from "@/components/DefusedScreen";
import { ExplodedScreen } from "@/components/ExplodedScreen";
import scoutLogo from "@/assets/scout_logo.jpg";

// Main page component
const Index = () => {
  const game = useGameState();
  const [view, setView] = useState<"main" | "admin">("main");
  const [pinError, setPinError] = useState("");

  const handlePinSubmit = (pin: string) => {
    // Check admin pin first
    if (game.checkAdminPin(pin)) {
      setView("admin");
      setPinError("");
      return;
    }
    // Check defuse pin
    if (game.isRunning) {
      if (game.checkDefusePin(pin)) {
        setPinError("");
      } else {
        setPinError("ACCESS DENIED — WRONG CODE");
        setTimeout(() => setPinError(""), 3000);
      }
    } else {
      setPinError("NO ACTIVE THREAT");
      setTimeout(() => setPinError(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center relative overflow-hidden">
      {/* Scanline overlay */}
      <div className="fixed inset-0 scanline pointer-events-none z-50" />

      {/* Header with logo */}
      <motion.header
        className="w-full flex items-center justify-center py-6 gap-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <img src={scoutLogo} alt="SGS Scout Logo" className="w-12 h-12 rounded-full object-cover" />
        <div>
          <h1 className="font-display text-lg sm:text-xl tracking-[0.2em] text-primary">
            SGS DEFENSE SYSTEM
          </h1>
          <p className="text-[10px] tracking-[0.4em] text-muted-foreground uppercase">
            Missile Intercept Terminal
          </p>
        </div>
      </motion.header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center gap-8 px-4 pb-8 w-full max-w-lg">
        {view === "admin" ? (
          <AdminPanel
            currentTime={game.timeLeftSeconds}
            currentPin={(game as any).defusePin}
            onSave={game.setAdminSettings}
            onStart={game.startTimer}
            onReset={game.resetGame}
            onBack={() => setView("main")}
            isRunning={game.isRunning}
            getShareUrl={game.getShareUrl}
          />
        ) : game.isDefused ? (
          <DefusedScreen onReset={game.resetGame} />
        ) : game.isExploded ? (
          <ExplodedScreen onReset={game.resetGame} />
        ) : (
          <>
            <MissileTimer timeLeftSeconds={game.timeLeftSeconds} isRunning={game.isRunning} />
            <div className="border-t border-border w-full" />
            <PinInput
              onSubmit={handlePinSubmit}
              error={pinError}
              label={game.isRunning ? "Enter Defuse Code" : "Enter Access Code"}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center">
        <p className="text-[10px] text-muted-foreground tracking-widest font-display">
          CLASSIFIED — SGS SCOUT OPERATIONS
        </p>
      </footer>
    </div>
  );
};

export default Index;
