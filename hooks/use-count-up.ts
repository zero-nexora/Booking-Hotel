import { useState, useEffect, useRef, useCallback } from "react";

type EasingName = "linear" | "easeOut" | "easeInOut" | "bounce";

const EASINGS: Record<EasingName, (t: number) => number> = {
  linear: (t) => t,
  easeOut: (t) => 1 - Math.pow(1 - t, 3),
  easeInOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  bounce: (t) => {
    const n = 7.5625,
      d = 2.75;
    if (t < 1 / d) return n * t * t;
    if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75;
    if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375;
    return n * (t -= 2.625 / d) * t + 0.984375;
  },
};

export interface UseCountUpOptions {
  from?: number;
  to: number;
  duration?: number;
  easing?: EasingName;
  decimals?: number;
  separator?: string;
  prefix?: string;
  suffix?: string;
  autoStart?: boolean;
  onComplete?: () => void;
}

export interface UseCountUpReturn {
  value: number;
  display: string;
  isDone: boolean;
  start: () => void;
  reset: () => void;
}

function formatNumber(
  n: number,
  decimals: number,
  separator: string,
  prefix: string,
  suffix: string,
): string {
  let s = n.toFixed(decimals);
  if (separator) {
    const [int, dec] = s.split(".");
    s =
      int.replace(/\B(?=(\d{3})+(?!\d))/g, separator) + (dec ? "." + dec : "");
  }
  return prefix + s + suffix;
}

export function useCountUp({
  from = 0,
  to,
  duration = 2000,
  easing = "easeOut",
  decimals = 0,
  separator = "",
  prefix = "",
  suffix = "",
  autoStart = true,
  onComplete,
}: UseCountUpOptions): UseCountUpReturn {
  const [value, setValue] = useState(from);
  const [isDone, setIsDone] = useState(false);

  const rafRef = useRef<number>(0);
  const startTsRef = useRef<number | undefined>(undefined);
  const runningRef = useRef(false);

  const latestRef = useRef({ from, to, duration, easing, onComplete });
  useEffect(() => {
    latestRef.current = { from, to, duration, easing, onComplete };
  });

  const runAnimation = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startTsRef.current = undefined;
    runningRef.current = true;

    const tick = (ts: number) => {
      if (!runningRef.current) return;
      startTsRef.current ??= ts;

      const {
        from: f,
        to: t,
        duration: d,
        easing: e,
        onComplete: cb,
      } = latestRef.current;
      const progress = Math.min((ts - startTsRef.current) / d, 1);
      const easeFn = EASINGS[e] ?? EASINGS.easeOut;
      const current = f + (t - f) * easeFn(progress);

      setValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setValue(t);
        setIsDone(true);
        runningRef.current = false;
        cb?.();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(() => {
    setIsDone(false);
    setValue(latestRef.current.from ?? 0);
    runAnimation();
  }, [runAnimation]);

  const reset = useCallback(() => {
    runningRef.current = false;
    cancelAnimationFrame(rafRef.current);
    setValue(latestRef.current.from ?? 0);
    setIsDone(false);
  }, []);

  useEffect(() => {
    if (!autoStart) return;
    setIsDone(false);
    setValue(from);
    runAnimation();
    return () => {
      runningRef.current = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [autoStart, from, runAnimation]);

  const display = formatNumber(value, decimals, separator, prefix, suffix);

  return { value, display, isDone, start, reset };
}
