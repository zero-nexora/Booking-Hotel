import { useEffect, useRef, useState } from "react";

export interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  enabled?: boolean;
  onIntersect?: () => void;
  onLeave?: () => void;
}

export function useIntersectionObserver<T extends Element = HTMLElement>({
  threshold = 0,
  rootMargin,
  triggerOnce = false,
  enabled = true,
  onIntersect,
  onLeave,
}: UseIntersectionObserverOptions = {}) {
  const ref = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const hasTriggered = useRef(false);
  const callbacksRef = useRef({ onIntersect, onLeave });

  useEffect(() => {
    callbacksRef.current = { onIntersect, onLeave };
  });

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (triggerOnce && hasTriggered.current) return;
          hasTriggered.current = true;
          setIsIntersecting(true);
          callbacksRef.current.onIntersect?.();
          if (triggerOnce) observer.disconnect();
        } else {
          setIsIntersecting(false);
          callbacksRef.current.onLeave?.();
          if (!triggerOnce) hasTriggered.current = false;
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce, enabled]);

  return { ref, isIntersecting };
}
