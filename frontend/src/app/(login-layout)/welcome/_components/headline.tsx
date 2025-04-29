"use client";

import { motion } from "motion/react";

const AnimatedText = ({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) => {
  return (
    <motion.p
      className="text-center text-[50px] font-670 leading-[54px]"
      initial={{ opacity: 0, y: 15, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.25, delay, ease: "easeInOut" }}
    >
      {children}
    </motion.p>
  );
};
export const Headline = () => {
  return (
    <div className="flex flex-col items-center gap-y-2">
      <div className="flex flex-row gap-2">
        <AnimatedText delay={0}>This is</AnimatedText>
        <AnimatedText delay={0.25}>the Future of</AnimatedText>
      </div>
      <div className="flex flex-row gap-2">
        <AnimatedText delay={0.5}>Ethereum</AnimatedText>
        <AnimatedText delay={0.75}>Staking</AnimatedText>
      </div>
    </div>
  );
};
