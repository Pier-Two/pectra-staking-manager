import { type ReactNode } from "react";
import { Skeleton } from "pec/components/ui/skeleton";
import { EnterAnimation } from "pec/app/_components/enter-animation";

type MyValidatorsCardProps = {
  title: string | null;
  body: ReactNode | null;
  subtext?: ReactNode | null;
  layoutId?: string;
  delay?: number;
  isLoading?: boolean;
};

/**
 * A card component that displays validator information with optional loading states
 * @param title - The title of the card
 * @param body - The main content of the card
 * @param subtext - Additional information displayed below the body
 * @param layoutId - Optional ID for layout animations
 * @param delay - Optional delay for animations
 * @param isLoading - Whether the card is in a loading state
 */
export const MyValidatorsCard = ({
  title,
  body,
  subtext,
  layoutId,
  delay,
  isLoading = false,
}: MyValidatorsCardProps) => {
  return (
    <EnterAnimation delay={delay} layoutId={layoutId}>
      <div className="flex h-32 flex-col space-y-3 rounded-xl bg-indigo-50 p-6 dark:bg-gray-950 dark:text-white">
        {isLoading && !title ? (
          <Skeleton className="h-4 w-24 bg-slate-50" />
        ) : (
          <p className="text-sm font-medium text-piertwo-text">{title}</p>
        )}

        <div className="flex flex-grow flex-col justify-end gap-y-1">
          {isLoading && !body ? (
            <Skeleton className="h-8 w-32 bg-slate-50" />
          ) : (
            <div className="text-2xl font-bold text-piertwoDark-text">
              {body}
            </div>
          )}

          {isLoading && !subtext ? (
            <Skeleton className="mt-1 h-3 w-20 bg-slate-50" />
          ) : (
            <p className="text-xs text-piertwo-text">{subtext}</p>
          )}
        </div>
      </div>
    </EnterAnimation>
  );
};
