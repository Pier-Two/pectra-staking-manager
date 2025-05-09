import type { ILogoPaths } from "pec/types/logo";

export type LogoType =
  | "PierTwo"
  | "Labrys"
  | "Hashlock"
  | "ESP"
  | "ETHFoundation";

export const logoPaths: Record<LogoType, ILogoPaths> = {
  PierTwo: {
    light: "/logos/light/PierTwo.svg",
    dark: "/logos/dark/PierTwo.svg",
  },
  Labrys: {
    light: "/logos/dark/Labrys.svg",
    dark: "/logos/dark/Labrys.svg",
  },
  Hashlock: {
    light: "/logos/light/Hashlock.svg",
    dark: "/logos/dark/Hashlock.svg",
  },
  ESP: {
    light: "/logos/light/ESP.svg",
    dark: "/logos/dark/ESP.svg",
  },
  ETHFoundation: {
    light: "/logos/light/ETH_Foundation.svg",
    dark: "/logos/dark/ETH_Foundation.svg",
  },
};
