"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { useCling } from "pec/hooks/useCling";
import { cn } from "pec/lib/utils";

interface ClingableElementProps {
  children: React.ReactNode;
  className?: string;
  scale?: number;
  shadowColor?: string;
  transition?: {
    duration?: number;
    type?: string;
    stiffness?: number;
    damping?: number;
  };
}

export const ClingableElement = ({
  children,
  className,
  scale = 1.05,
  shadowColor = "white",
  transition = {
    duration: 0.2,
    type: "spring",
    stiffness: 150,
    damping: 15,
  },
}: ClingableElementProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const isClung = useCling(elementRef);

  return (
    <motion.div
      ref={elementRef}
      animate={{
        scale: isClung ? scale : 1,
        shadow: isClung
          ? `0px 0px 20px 0px ${shadowColor}`
          : `0px 0px 0px 0px ${shadowColor}`,
      }}
      transition={transition}
      className={cn("absorb-cursor", className)}
    >
      {children}
    </motion.div>
  );
};
