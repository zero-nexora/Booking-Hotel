import { DEFAULT_DEBOUNCE } from "@/lib/constants";
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number = DEFAULT_DEBOUNCE) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
