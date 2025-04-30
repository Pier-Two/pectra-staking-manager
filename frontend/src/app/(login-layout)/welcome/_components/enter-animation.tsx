"use client";

import { motion } from "motion/react";

export const EnterAnimation = ({
  children,
  delay = 0,
  className,
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "down";
}) => {
  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y: direction === "up" ? 15 : -15,
        filter: "blur(10px)",
      }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.25, delay, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

export const EnterAnimationParagraph = ({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  return (
    <motion.p
      className={className}
      initial={{ opacity: 0, y: 15, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.25, delay, ease: "easeInOut" }}
    >
      {children}
    </motion.p>
  );
};
