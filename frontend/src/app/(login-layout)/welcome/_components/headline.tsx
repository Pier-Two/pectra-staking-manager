"use client";

import { motion } from "motion/react";
import { welcomeAnimationDelays } from "pec/constants/animationDelays";

const AnimatedText = ({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) => {
  return (
    <div className="group relative">
      <motion.p
        className="relative text-center text-[50px] font-670 leading-[54px]"
        initial={{ opacity: 0, y: 15, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.25, delay, ease: "easeInOut" }}
      >
        <span className="relative z-10 text-[#4C4C4C] dark:text-white">
          {children}
        </span>
      </motion.p>
    </div>
  );
};

export const Headline = () => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <AnimatedText delay={welcomeAnimationDelays.headline.thisIs}>
          Welcome to
        </AnimatedText>
        <AnimatedText delay={welcomeAnimationDelays.headline.theFutureOf}>
          the Future of
        </AnimatedText>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <AnimatedText delay={welcomeAnimationDelays.headline.ethereum}>
          Ethereum
        </AnimatedText>
        <AnimatedText delay={welcomeAnimationDelays.headline.staking}>
          Staking
        </AnimatedText>
      </div>
    </div>
  );
};
