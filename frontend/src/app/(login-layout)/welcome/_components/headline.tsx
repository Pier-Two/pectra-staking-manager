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
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <AnimatedText delay={welcomeAnimationDelays.headline.thisIs}>
          This is
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
