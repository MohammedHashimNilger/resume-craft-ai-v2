import { useRef, useCallback } from "react";

/** Returns a debounced version of fn that waits `delay` ms of inactivity before firing. */
export function useDebouncedCallback(fn, delay = 800) {
  const timeoutRef = useRef(null);

  return useCallback(
    (...args) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => fn(...args), delay);
    },
    [fn, delay]
  );
}
