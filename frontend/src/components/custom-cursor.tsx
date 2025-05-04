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

export const CustomCursor = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isClinging, setIsClinging] = useState(false);
  const [clingTarget, setClingTarget] = useState<DOMRect | null>(null);

  // Smooth spring animation for the cursor
  const cursorX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const cursorY = useSpring(mouseY, { stiffness: 150, damping: 15 });

  useEffect(() => {
    function findClingTarget(
      x: number,
      y: number,
      distancePx = 64,
    ): DOMRect | null {
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
          return rect;
        }
      }
      return null;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = findClingTarget(e.clientX, e.clientY, 64);
      if (rect) {
        setIsClinging(true);
        setClingTarget(rect);
        mouseX.set(rect.left + rect.width / 2);
        mouseY.set(rect.top + rect.height / 2);
        window.dispatchEvent(
          new CustomEvent("cursor-cling", { detail: { rect } }),
        );
      } else {
        setIsClinging(false);
        setClingTarget(null);
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
        window.dispatchEvent(new CustomEvent("cursor-uncling"));
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-50 size-32 rounded-full bg-primary mix-blend-screen"
      animate={{
        scale: isClinging ? 0 : 1,
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
