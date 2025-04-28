import { cn } from "pec/lib/utils";
import {
  createElement,
  type DetailedHTMLProps,
  type HTMLAttributes,
} from "react";

export interface ValidatorCardWrapperProps<
  T extends keyof JSX.IntrinsicElements = "div",
> extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  as?: T;
  children: React.ReactNode;
  className?: string;
  clearBackground?: boolean;
  isSelected?: boolean;
}

export const ValidatorCardBorderStyles = ({
  clearBackground,
  onClick,
  isSelected,
  isHoveringOverride,
}: Pick<
  ValidatorCardWrapperProps,
  "clearBackground" | "onClick" | "isSelected"
> & { isHoveringOverride?: boolean }) => ({
  "border border-transparent hover:border cursor-pointer": onClick,
  "hover:!border-primary dark:hover:!border-indigo-900":
    onClick && !clearBackground,
  "hover:!border-primary dark:hover:!bg-gray-900": onClick && clearBackground,
  "border border-primary dark:border-indigo-900":
    isSelected && !clearBackground,
  // This is only used by the Validator Table row which doesn't support the tailwind hover:
  "border-primary dark:border-indigo-900":
    isHoveringOverride && !clearBackground,
});

export const ValidatorCardWrapper = <
  T extends keyof JSX.IntrinsicElements = "div",
>({
  as,
  onClick,
  children,
  className,
  clearBackground,
  isSelected,
  ...props
}: ValidatorCardWrapperProps<T>) => {
  return createElement(
    as ?? "div",
    {
      className: cn(
        "flex w-full h-16 items-center justify-between gap-x-4 rounded-2xl px-4 py-2 text-sm group transition-colors duration-200",
        {
          "border bg-transparent border-indigo-200 dark:border-indigo-900":
            clearBackground,
          "bg-white dark:bg-gray-900": !clearBackground,
          ...ValidatorCardBorderStyles({
            clearBackground,
            onClick,
            isSelected,
          }),
        },
        className,
      ),
      onClick,
      ...props,
    },
    children,
  );
};
