import { cn } from "pec/lib/utils";
import { createElement, DetailedHTMLProps, HTMLAttributes } from "react";

export interface ValidatorCardWrapperProps<
  T extends keyof JSX.IntrinsicElements = "div",
> extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  as?: T;
  children: React.ReactNode;
  className?: string;
  shrink?: boolean;
  clearBackground?: boolean;
  isSelected?: boolean;
}

export const ValidatorCardBorderStyles = ({
  clearBackground,
  onClick,
  isSelected,
}: Pick<
  ValidatorCardWrapperProps,
  "clearBackground" | "onClick" | "isSelected"
>) => ({
  "border border-transparent hover:border": onClick,
  "cursor-pointer hover:!border-indigo-500 dark:hover:!border-indigo-900":
    onClick && !clearBackground,
  "hover:!border-indigo-300 dark:hover:!bg-gray-900":
    onClick && clearBackground,
  "border border-indigo-500 dark:border-indigo-900":
    isSelected && !clearBackground,
});

export const ValidatorCardWrapper = <
  T extends keyof JSX.IntrinsicElements = "div",
>({
  as,
  onClick,
  children,
  className,
  shrink,
  clearBackground,
  isSelected,
  ...props
}: ValidatorCardWrapperProps<T>) => {
  return createElement(
    as ?? "div",
    {
      className: cn(
        "flex h-16 items-center justify-between gap-x-4 rounded-2xl px-4 py-2 text-sm",
        {
          "w-[95%]": shrink,
          "w-full": !shrink,
          "border bg-indigo-50 dark:bg-indigo-950": clearBackground,
          "bg-white dark:bg-black": !clearBackground,
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
