import { useId } from "react";
import { cn } from "pec/lib/utils";
export const PectraSpinner = ({ className }: { className?: string }) => {
  const uniqueId = useId();
  const gradientId = `gradient-${uniqueId}`;

  return (
    <svg
      className={cn("h-6 w-6 animate-spin", className)}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="11.34%" stopColor="#00FFA7" />
          <stop offset="31.73%" stopColor="#5164DC" />
          <stop offset="59.22%" stopColor="#313C86" />
          <stop offset="100%" stopColor="rgba(113, 255, 224, 0.8)" />
        </linearGradient>
      </defs>

      <path
        d="M3 12a9 9 0 0 1 18 0M12 3a9 9 0 0 1 7.5 13.5"
        stroke={`url(#${gradientId})`}
      />
    </svg>
  );
};
