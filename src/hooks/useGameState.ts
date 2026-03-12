import { useState, useEffect, useCallback } from "react";

const ADMIN_PIN = "7285463333";

interface GameState {
  timeLeftSeconds: number;
  defusePin: string;
  isRunning: boolean;
  isDefused: boolean;
  isExploded: boolean;
  endAtMs: number | null;
}

const DEFAULT_STATE: GameState = {
  timeLeftSeconds: 600, // 10 minutes default
  defusePin: "1234567890",
  isRunning: false,
  isDefused: false,
  isExploded: false,
  endAtMs: null,
};

export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    // Check URL params first (shared config / auto-start link)
    const params = new URLSearchParams(window.location.search);
    const urlEnd = params.get("e");
    const urlTime = params.get("t");
    const urlPin = params.get("p");
    const urlStart = params.get("s");

    if (urlPin && urlEnd) {
      const parsedEndAt = parseInt(urlEnd, 10);
      const endAtMs = Number.isFinite(parsedEndAt) ? parsedEndAt : Date.now();
      const nowMs = Date.now();
      const diffSeconds = Math.max(
        0,
        Math.floor((endAtMs - nowMs) / 1000)
      );
      const defusePin = urlPin;
      const isRunning = urlStart === "1";
      window.history.replaceState({}, "", window.location.pathname);
      return {
        ...DEFAULT_STATE,
        timeLeftSeconds: diffSeconds,
        defusePin,
        isRunning,
        endAtMs,
      };
    }

    if (urlTime && urlPin) {
      const timeLeftSeconds = parseInt(urlTime, 10);
      const defusePin = urlPin;
      const isRunning = urlStart === "1";
      const endAtMs =
        isRunning && Number.isFinite(timeLeftSeconds)
          ? Date.now() + timeLeftSeconds * 1000
          : null;
      // Clean URL without reloading
      window.history.replaceState({}, "", window.location.pathname);
      return {
        ...DEFAULT_STATE,
        timeLeftSeconds,
        defusePin,
        isRunning,
        endAtMs,
      };
    }

    const saved = localStorage.getItem("missile-game-state");
    if (saved) {
      const parsed = JSON.parse(saved) as {
        timeLeftSeconds: number;
        defusePin: string;
        isRunning: boolean;
        endAtMs?: number | null;
      };

      let endAtMs =
        typeof parsed.endAtMs === "number" ? parsed.endAtMs : null;
      let timeLeftSeconds = parsed.timeLeftSeconds;

      if (endAtMs) {
        const nowMs = Date.now();
        const diffSeconds = Math.max(
          0,
          Math.floor((endAtMs - nowMs) / 1000)
        );
        timeLeftSeconds = diffSeconds;
      }

      return {
        ...DEFAULT_STATE,
        timeLeftSeconds,
        defusePin: parsed.defusePin,
        isRunning: parsed.isRunning,
        endAtMs,
        isDefused: false,
        isExploded: false,
      };
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
        endAtMs: state.endAtMs,
      })
    );
  }, [state.timeLeftSeconds, state.defusePin, state.isRunning, state.endAtMs]);

  // Countdown timer
  useEffect(() => {
    if (!state.isRunning || state.isDefused || state.isExploded) return;
    if (state.timeLeftSeconds <= 0) {
      setState((s) => ({ ...s, isExploded: true, isRunning: false }));
      return;
    }
    const interval = setInterval(() => {
      setState((s) => {
        if (s.isDefused || s.isExploded || !s.isRunning) {
          return s;
        }

        if (s.endAtMs) {
          const nowMs = Date.now();
          const diffSeconds = Math.max(
            0,
            Math.floor((s.endAtMs - nowMs) / 1000)
          );
          if (diffSeconds <= 0) {
            return {
              ...s,
              timeLeftSeconds: 0,
              isExploded: true,
              isRunning: false,
            };
          }
          return { ...s, timeLeftSeconds: diffSeconds };
        }

        if (s.timeLeftSeconds <= 1) {
          return {
            ...s,
            timeLeftSeconds: 0,
            isExploded: true,
            isRunning: false,
          };
        }
        return { ...s, timeLeftSeconds: s.timeLeftSeconds - 1 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [
    state.isRunning,
    state.isDefused,
    state.isExploded,
    state.timeLeftSeconds,
    state.endAtMs,
  ]);

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
      endAtMs: null,
    }));
  }, []);

  const startTimer = useCallback(() => {
    setState((s) => ({
      ...s,
      isRunning: true,
      isDefused: false,
      isExploded: false,
      endAtMs: Date.now() + s.timeLeftSeconds * 1000,
    }));
  }, []);

  const resetGame = useCallback(() => {
    setState((s) => ({
      ...s,
      isRunning: false,
      isDefused: false,
      isExploded: false,
      endAtMs: null,
    }));
  }, []);

  const getShareUrl = useCallback(
    (autoStart: boolean = false) => {
      const base = window.location.origin + window.location.pathname;

      const endAtMs =
        state.endAtMs ??
        Date.now() + Math.max(0, state.timeLeftSeconds) * 1000;

      const params = new URLSearchParams({
        e: endAtMs.toString(),
        t: state.timeLeftSeconds.toString(),
        p: state.defusePin,
      });

      if (autoStart) params.set("s", "1");

      return `${base}?${params.toString()}`;
    },
    [state.endAtMs, state.timeLeftSeconds, state.defusePin]
  );

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
