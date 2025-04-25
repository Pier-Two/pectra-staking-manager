import { cn } from "pec/lib/utils";
import { MouseEvent } from "react";

interface ValidatorCardWrapperProps {
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  children: React.ReactNode;
  className?: string;
  shrink?: boolean;
  withBackground?: boolean;
}

export const ValidatorCardWrapper = ({
  onClick,
  children,
  className,
  shrink,
  withBackground,
}: ValidatorCardWrapperProps) => {
  return (
    <div
      className={cn(
        "flex h-16 items-center justify-between gap-x-4 rounded-2xl bg-white px-4 py-2 text-sm",
        {
          "cursor-pointer hover:border-indigo-500 dark:hover:border-gray-600":
            onClick && !withBackground,
          "hover:border-indigo-300 dark:hover:bg-gray-900":
            onClick && withBackground,
          "w-[95%]": shrink,
          "w-full": !shrink,
          "bg-indigo-50 dark:bg-indigo-950": withBackground,
        },
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
