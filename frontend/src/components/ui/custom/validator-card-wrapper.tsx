import { cn } from "pec/lib/utils";
import { createElement, DetailedHTMLProps, HTMLAttributes } from "react";

interface ValidatorCardWrapperProps<
  T extends keyof JSX.IntrinsicElements = "div",
> extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  as?: T;
  children: React.ReactNode;
  className?: string;
  shrink?: boolean;
  withBackground?: boolean;
}

export const ValidatorCardWrapper = <
  T extends keyof JSX.IntrinsicElements = "div",
>({
  as,
  onClick,
  children,
  className,
  shrink,
  withBackground,
  ...props
}: ValidatorCardWrapperProps<T>) => {
  return createElement(
    as || "div",
    {
      className: cn(
        "flex h-16 items-center justify-between gap-x-4 rounded-2xl bg-white px-4 py-2 text-sm",
        {
          "cursor-pointer hover:border-indigo-500 dark:hover:border-gray-600":
            onClick && !withBackground,
          "hover:border-indigo-300 dark:hover:bg-gray-900":
            onClick && withBackground,
          "w-[95%]": shrink,
          "w-full": !shrink,
          "bg-indigo-50 dark:bg-indigo-950": withBackground,
          border: !withBackground,
        },
        className,
      ),
      onClick,
      ...props,
    },
    children,
  );
};
