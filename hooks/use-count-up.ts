import { useState, useEffect, useRef, useCallback } from "react";

type EasingFn = (t: number) => number;

const easings: Record<string, EasingFn> = {
  linear:    (t) => t,
  easeOut:   (t) => 1 - Math.pow(1 - t, 3),
  easeInOut: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  bounce:    (t) => {
    const n1 = 7.5625, d1 = 2.75;
    if (t < 1 / d1)        return n1 * t * t;
    else if (t < 2 / d1)   return n1 * (t -= 1.5 / d1) * t + 0.75;
    else if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    else                   return n1 * (t -= 2.625 / d1) * t + 0.984375;
  },
};

export interface UseCountUpOptions {
  from?:       number;
  to:          number;
  duration?:   number;
  easing?:     keyof typeof easings;
  prefix?:     string;
  suffix?:     string;
  decimals?:   number;
  separator?:  string;
  autoStart?:  boolean;
  onComplete?: () => void;
}

export interface UseCountUpReturn {
  value:   number;
  display: string;
  start:   () => void;
  reset:   () => void;
  isDone:  boolean;
}

export function useCountUp(opts: UseCountUpOptions): UseCountUpReturn {
  const {
    from = 0, to, duration = 2000,
    easing = "easeOut", prefix = "", suffix = "",
    decimals = 0, separator = "",
    autoStart = true, onComplete,
  } = opts;

  const [value, setVal]   = useState(from);
  const [isDone, setDone] = useState(false);

  const rafRef      = useRef<number>(0);
  const startTs     = useRef<number | undefined>(undefined);
  const runningRef  = useRef(false);

  const optsRef = useRef({ from, to, duration, easing, onComplete });
  useEffect(() => {
    optsRef.current = { from, to, duration, easing, onComplete };
  }, [from, to, duration, easing, onComplete]);

  const format = useCallback((n: number) => {
    let s = n.toFixed(decimals);
    if (separator) {
      const [int, dec] = s.split(".");
      s = int.replace(/\B(?=(\d{3})+(?!\d))/g, separator) + (dec ? "." + dec : "");
    }
    return prefix + s + suffix;
  }, [decimals, separator, prefix, suffix]);

  const runRAF = useCallback(() => {
    const easeFn = easings[optsRef.current.easing] ?? easings.easeOut;

    const tick = (ts: number) => {
      if (!runningRef.current) return;
      if (!startTs.current) startTs.current = ts;

      const { from: f, to: t, duration: d, onComplete: cb } = optsRef.current;
      const elapsed  = ts - startTs.current;
      const progress = Math.min(elapsed / d, 1);
      const current  = f + (t - f) * easeFn(progress);

      setVal(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setVal(t);
        setDone(true);
        runningRef.current = false;
        cb?.();
      }
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startTs.current    = undefined;
    runningRef.current = true;
    rafRef.current     = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(() => {
    setDone(false);
    setVal(optsRef.current.from ?? 0);
    runRAF();
  }, [runRAF]);

  const reset = useCallback(() => {
    runningRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setVal(optsRef.current.from ?? 0);
    setDone(false);
  }, []);

  const autoStartRef = useRef(autoStart);
  useEffect(() => {
    autoStartRef.current = autoStart;
  }, [autoStart]);

  useEffect(() => {
    if (!autoStartRef.current) return;
    setDone(false);
    setVal(optsRef.current.from ?? 0);
    runRAF();
    return () => {
      runningRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runRAF]);

  return { value, display: format(value), start, reset, isDone };
}