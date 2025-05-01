import { useId } from "react";
import { HiShieldCheck } from "react-icons/hi";

import { cn } from "pec/lib/utils";

/**
 * This component is used to render a gradient shield icon.
 * It first defines the gradient in an invisible SVG element,
 * then uses that gradient to color the icon.
 *
 * @param {Object} props - The component props.
 * @param {string} [props.className] - Additional CSS classes for the icon.
 * @returns {JSX.Element} The rendered gradient shield icon.
 */
export const GradientShield = ({
  className,
}: {
  className?: string;
}): JSX.Element => {
  const id = useId();

  return (
    <>
      {/* we first need to define the gradient to use in the icon */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffa7" />
            <stop offset="31.73%" stopColor="#5164dc" />
            <stop offset="59.22%" stopColor="#313c86" />
            <stop offset="100%" stopColor="rgba(113, 255, 224, 0.8)" />
          </linearGradient>
        </defs>
      </svg>
      {/* render the icon with the gradient */}
      <HiShieldCheck className={cn(className)} fill={`url(#${id})`} />
    </>
  );
};
