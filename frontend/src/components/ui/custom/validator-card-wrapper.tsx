import { cn } from "pec/lib/utils";
import { MouseEvent } from "react";

interface ValidatorCardWrapperProps {
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  children: React.ReactNode;
  className?: string;
  shrink?: boolean;
}

export const ValidatorCardWrapper = ({
  onClick,
  children,
  className,
  shrink,
}: ValidatorCardWrapperProps) => {
  return (
    <div
      className={cn(
        "flex-col-3 flex h-16 items-center justify-between gap-x-4 rounded-2xl border border-border bg-white px-4 py-2 dark:border-gray-800 dark:bg-black",
        {
          "cursor-pointer hover:border-indigo-500 dark:hover:border-gray-600":
            onClick,
          "w-[95%]": shrink,
          "w-full": !shrink,
        },
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
