import { cn } from "pec/lib/utils";
import type { ComponentProps } from "react";
import { motion } from "motion/react";
import { omit } from "lodash";

export type ValidatorCardWrapperProps = (
  | ({
      as?: "div";
    } & ComponentProps<typeof motion.div>)
  | ({
      as: "tr";
    } & ComponentProps<typeof motion.tr>)
) & {
  clearBackground?: boolean;
  isSelected?: boolean;
  isPermanentSelected?: boolean;
};

interface ValidatorCardBorderStylesProps
  extends Pick<
    ValidatorCardWrapperProps,
    "clearBackground" | "onClick" | "isSelected"
  > {
  isHoveringOverride?: boolean;
  isPermanentSelected?: boolean;
}

export const ValidatorCardBorderStyles = ({
  clearBackground,
  onClick,
  isSelected,
  isHoveringOverride,
  isPermanentSelected,
}: ValidatorCardBorderStylesProps) => ({
  "border bg-transparent border-indigo-200 dark:border-indigo-900":
    clearBackground,
  "border border-transparent hover:border cursor-pointer": onClick,
  "hover:!border-primary dark:hover:!border-indigo-900":
    onClick && !clearBackground,
  "hover:!border-primary dark:hover:!bg-gray-900":
    onClick && clearBackground && !isPermanentSelected,
  "border border-primary dark:border-indigo-900":
    isSelected && !clearBackground,
  // This is only used by the Validator Table row which doesn't support the tailwind hover:
  "border-primary dark:border-indigo-900":
    (isHoveringOverride && !clearBackground) || isPermanentSelected,
});

export const ValidatorCardWrapper = ({
  as = "div",
  onClick,
  children,
  className,
  clearBackground,
  isSelected,
  isPermanentSelected,
  ...props
}: ValidatorCardWrapperProps) => {
  const MotionComponent = motion[as];
  return (
    <MotionComponent
      className={cn(
        "group flex h-16 w-full items-center justify-between gap-x-4 rounded-2xl px-4 py-2 text-sm transition-colors duration-200",
        {
          ...ValidatorCardBorderStyles({
            clearBackground,
            onClick,
            isSelected,
            isPermanentSelected,
          }),
        },
        className,
      )}
      onClick={onClick}
      {...omit(props, "ref")}
    >
      {children}
    </MotionComponent>
  );
};
