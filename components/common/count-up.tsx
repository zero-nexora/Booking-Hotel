import { useCountUp } from "@/hooks/use-count-up";
import { useState, useEffect, useRef } from "react";

export interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  easing?: "linear" | "easeOut" | "easeInOut" | "bounce";
  prefix?: string;
  suffix?: string;
  decimals?: number;
  separator?: string;
  autoStart?: boolean;
  triggerOnView?: boolean;
  viewThreshold?: number;
  triggerOnce?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onComplete?: () => void;
  render?: (opts: {
    value: number;
    display: string;
    isDone: boolean;
  }) => React.ReactNode;
}

export function CountUp({
  to,
  from = 0,
  duration = 2000,
  easing = "easeOut",
  prefix = "",
  suffix = "",
  decimals = 0,
  separator = "",
  autoStart = true,
  triggerOnView = false,
  viewThreshold = 0.3,
  triggerOnce = true,
  className,
  style,
  onComplete,
  render,
}: CountUpProps) {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const hasTriggered = useRef(false);
  const [shouldStart, setShouldStart] = useState(!triggerOnView && autoStart);

  useEffect(() => {
    if (!triggerOnView) return;
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (triggerOnce && hasTriggered.current) return;
          hasTriggered.current = true;
          setShouldStart(true);
          if (triggerOnce) observer.disconnect();
        } else if (!triggerOnce) {
          setShouldStart(false);
          hasTriggered.current = false;
        }
      },
      { threshold: viewThreshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [triggerOnView, viewThreshold, triggerOnce]);

  const { value, display, isDone } = useCountUp({
    from,
    to,
    duration,
    easing,
    prefix,
    suffix,
    decimals,
    separator,
    autoStart: shouldStart,
    onComplete,
  });

  return (
    <span ref={wrapperRef} className={className} style={style}>
      {render ? render({ value, display, isDone }) : display}
    </span>
  );
}

export default CountUp;
