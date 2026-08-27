import { useEffect, useState } from "react";

/**
 * True when the ref'd element's content is taller than the element itself
 * — i.e. it would spill past one page. Re-checks whenever `deps` change.
 */
export function useOverflowDetector(ref, deps = []) {
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Small tolerance for sub-pixel rounding
    setIsOverflowing(el.scrollHeight > el.clientHeight + 2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return isOverflowing;
}
