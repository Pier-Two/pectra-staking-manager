import { useEffect, useState, RefObject } from "react";

/**
 * Hook to detect if the custom cursor is "clinging" to the given element.
 * @param ref - React ref to the element to check for clinging.
 * @returns isClung - boolean indicating if the element is being clung to.
 */
export function useCling(ref: RefObject<HTMLElement>): boolean {
  const [isClung, setIsClung] = useState(false);

  useEffect(() => {
    function handleCling(e: CustomEvent<{ rect: DOMRect }>) {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Compare rects to see if this is the clung element
      if (
        Math.abs(rect.left - e.detail.rect.left) < 1 &&
        Math.abs(rect.top - e.detail.rect.top) < 1 &&
        Math.abs(rect.width - e.detail.rect.width) < 1 &&
        Math.abs(rect.height - e.detail.rect.height) < 1
      ) {
        setIsClung(true);
      }
    }
    function handleUncling() {
      setIsClung(false);
    }
    window.addEventListener("cursor-cling", handleCling as EventListener);
    window.addEventListener("cursor-uncling", handleUncling);
    return () => {
      window.removeEventListener("cursor-cling", handleCling as EventListener);
      window.removeEventListener("cursor-uncling", handleUncling);
    };
  }, [ref]);

  return isClung;
}
