"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Returns the closest point on a rectangle to a given point.
 */
function closestPointOnRect(x: number, y: number, rect: DOMRect) {
  const closestX = Math.max(rect.left, Math.min(x, rect.right));
  const closestY = Math.max(rect.top, Math.min(y, rect.bottom));
  return { x: closestX, y: closestY };
}

// Type for cling target info
type ClingTarget = {
  rect: DOMRect;
  borderRadius: string;
  element: HTMLElement;
};

export const CustomCursor = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isClinging, setIsClinging] = useState(false);
  const [clingTarget, setClingTarget] = useState<ClingTarget | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Default cursor size
  const defaultSize = 64; // 32 * 4 (tailwind size-32)
  const defaultRadius = "999px";

  // Smooth spring animation for the cursor
  const cursorX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const cursorY = useSpring(mouseY, { stiffness: 150, damping: 15 });

  useEffect(() => {
    // Check if device is touch-enabled
    const checkTouchDevice = () => {
      const hasTouchScreen =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-expect-error - for older browsers
        navigator.msMaxTouchPoints > 0;

      setIsTouchDevice(hasTouchScreen);
    };

    // Initial check
    checkTouchDevice();

    // Listen for changes in touch capability (e.g., when device is connected/disconnected)
    window.addEventListener("touchstart", checkTouchDevice, { once: true });

    return () => {
      window.removeEventListener("touchstart", checkTouchDevice);
    };
  }, []);

  useEffect(() => {
    // If it's a touch device, don't set up mouse tracking
    if (isTouchDevice) return;

    function findClingTarget(
      x: number,
      y: number,
      distancePx = 64,
    ): ClingTarget | null {
      const absorbers = document.querySelectorAll(
        '[data-absorb-cursor="true"], .absorb-cursor',
      );
      for (const el of absorbers) {
        const rect = (el as HTMLElement).getBoundingClientRect();
        // Find closest point on rect to mouse
        const { x: closestX, y: closestY } = closestPointOnRect(x, y, rect);
        const dx = x - closestX;
        const dy = y - closestY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= distancePx) {
          // Get computed border-radius
          const computedStyle = window.getComputedStyle(el as HTMLElement);
          const borderRadius = computedStyle.borderRadius || "0px";
          return { rect, borderRadius, element: el as HTMLElement };
        }
      }
      return null;
    }

    const updateCursorPosition = (x: number, y: number) => {
      const target = findClingTarget(x, y, 16);

      // If we have a current cling target and a new target, and they're different elements
      if (clingTarget && target && clingTarget.element !== target.element) {
        // Dispatch uncling for the old target
        window.dispatchEvent(new CustomEvent("cursor-uncling"));
      }

      if (target) {
        setIsClinging(true);
        setClingTarget(target);
        // Move cursor to center of the rect
        mouseX.set(target.rect.left + target.rect.width / 2);
        mouseY.set(target.rect.top + target.rect.height / 2);
        // Dispatch event for button scaling
        window.dispatchEvent(
          new CustomEvent("cursor-cling", { detail: { rect: target.rect } }),
        );
      } else {
        setIsClinging(false);
        setClingTarget(null);
        mouseX.set(x);
        mouseY.set(y);
        window.dispatchEvent(new CustomEvent("cursor-uncling"));
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateCursorPosition(e.clientX, e.clientY);
    };

    const handleScroll = () => {
      // Get the current mouse position from the motion values
      const currentX = mouseX.get();
      const currentY = mouseY.get();
      updateCursorPosition(currentX, currentY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, true); // true for capture phase to catch all scroll events

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [mouseX, mouseY, clingTarget, isTouchDevice]);

  // Morphing styles
  const width =
    isClinging && clingTarget ? clingTarget.rect.width : defaultSize;
  const height =
    isClinging && clingTarget ? clingTarget.rect.height : defaultSize;
  const borderRadius =
    isClinging && clingTarget ? clingTarget.borderRadius : defaultRadius;

  // If it's a touch device, don't render the cursor
  if (isTouchDevice) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-50 bg-primary mix-blend-screen blur-md dark:bg-primary/60 dark:blur-xl"
      animate={{
        width,
        height,
        borderRadius,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
      }}
      style={{
        x: cursorX,
        y: cursorY,
        translateX: "-50%",
        translateY: "-50%",
      }}
    />
  );
};
