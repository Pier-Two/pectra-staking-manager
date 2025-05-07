"use client";
export const formatTick = (value: number): string => {
  const abs = Math.abs(value);
  const format = (val: number, suffix: string) =>
    parseFloat(val.toFixed(2)).toString() + suffix;

  if (abs >= 1e12) return format(value / 1e12, "t");
  if (abs >= 1e9) return format(value / 1e9, "bn");
  if (abs >= 1e6) return format(value / 1e6, "m");
  if (abs >= 1e3) return format(value / 1e3, "k");
  if (abs === 0) return "0";

  if (abs < 100 && abs > 0.1) return value.toFixed(2);
  return value.toFixed(2);
};
