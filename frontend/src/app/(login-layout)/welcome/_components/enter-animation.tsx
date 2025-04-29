"use client";

import { motion } from "motion/react";

export const EnterAnimation = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: 100 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay,
      }}
    >
      {children}
    </motion.div>
  );
};
