import { useState, useEffect, useCallback } from "react";

const ADMIN_PIN = "7285463333";

interface GameState {
  timeLeftSeconds: number;
  defusePin: string;
  isRunning: boolean;
  isDefused: boolean;
  isExploded: boolean;
}

const DEFAULT_STATE: GameState = {
  timeLeftSeconds: 600, // 10 minutes default
  defusePin: "1234567890",
  isRunning: false,
  isDefused: false,
  isExploded: false,
};

export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    // Check URL params first (shared config link)
    const params = new URLSearchParams(window.location.search);
    const urlTime = params.get("t");
    const urlPin = params.get("p");
    const urlStart = params.get("s");
    if (urlTime && urlPin) {
      const timeLeftSeconds = parseInt(urlTime, 10);
      const defusePin = urlPin;
      const isRunning = urlStart === "1";
      // Clean URL without reloading
      window.history.replaceState({}, "", window.location.pathname);
      return { ...DEFAULT_STATE, timeLeftSeconds, defusePin, isRunning };
    }
    const saved = localStorage.getItem("missile-game-state");
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...parsed, isDefused: false, isExploded: false };
    }
    return DEFAULT_STATE;
  });

  // Save admin settings to localStorage
  useEffect(() => {
    localStorage.setItem(
      "missile-game-state",
      JSON.stringify({
        timeLeftSeconds: state.timeLeftSeconds,
        defusePin: state.defusePin,
        isRunning: state.isRunning,
      })
    );
  }, [state.timeLeftSeconds, state.defusePin, state.isRunning]);

  // Countdown timer
  useEffect(() => {
    if (!state.isRunning || state.isDefused || state.isExploded) return;
    if (state.timeLeftSeconds <= 0) {
      setState((s) => ({ ...s, isExploded: true, isRunning: false }));
      return;
    }
    const interval = setInterval(() => {
      setState((s) => {
        if (s.timeLeftSeconds <= 1) {
          return { ...s, timeLeftSeconds: 0, isExploded: true, isRunning: false };
        }
        return { ...s, timeLeftSeconds: s.timeLeftSeconds - 1 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [state.isRunning, state.isDefused, state.isExploded, state.timeLeftSeconds]);

  const checkAdminPin = useCallback((pin: string) => pin === ADMIN_PIN, []);

  const checkDefusePin = useCallback(
    (pin: string) => {
      if (pin === state.defusePin) {
        setState((s) => ({ ...s, isDefused: true, isRunning: false }));
        return true;
      }
      return false;
    },
    [state.defusePin]
  );

  const setAdminSettings = useCallback((timeSeconds: number, pin: string) => {
    setState((s) => ({
      ...s,
      timeLeftSeconds: timeSeconds,
      defusePin: pin,
      isDefused: false,
      isExploded: false,
    }));
  }, []);

  const startTimer = useCallback(() => {
    setState((s) => ({ ...s, isRunning: true, isDefused: false, isExploded: false }));
  }, []);

  const resetGame = useCallback(() => {
    setState((s) => ({
      ...s,
      isRunning: false,
      isDefused: false,
      isExploded: false,
    }));
  }, []);

  const getShareUrl = useCallback((autoStart: boolean = false) => {
    const base = window.location.origin + window.location.pathname;
    const params = new URLSearchParams({
      t: state.timeLeftSeconds.toString(),
      p: state.defusePin,
    });
    if (autoStart) params.set("s", "1");
    return `${base}?${params.toString()}`;
  }, [state.timeLeftSeconds, state.defusePin]);

  return {
    ...state,
    checkAdminPin,
    checkDefusePin,
    setAdminSettings,
    startTimer,
    resetGame,
    getShareUrl,
  };
}
