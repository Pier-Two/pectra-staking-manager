import { type ReactNode } from "react";
import { Skeleton } from "pec/components/ui/skeleton";

type MyValidatorsCardProps = {
  title: string;
  body: ReactNode;
  subtext: ReactNode;
};

export const MyValidatorsCard = ({
  title,
  body,
  subtext,
}: MyValidatorsCardProps) => {
  return (
    <div className="flex h-32 flex-col space-y-3 rounded-xl bg-indigo-50 p-6 dark:bg-gray-950 dark:text-white">
      <p className="text-sm font-medium text-piertwo-text">{title}</p>

      <div className="flex flex-grow flex-col justify-end gap-y-1">
        <div className="text-2xl font-bold text-piertwoDark-text">{body}</div>
        {!!subtext ? (
          <p className="text-xs text-piertwo-text">{subtext}</p>
        ) : (
          <div className="h-3" />
        )}
      </div>
    </div>
  );
};

export const MyValidatorsCardLoading = ({
  title,
  body,
  subtext,
}: Partial<MyValidatorsCardProps>) => {
  return (
    <div className="flex h-32 flex-col space-y-3 rounded-xl bg-indigo-50 p-6 dark:bg-gray-950 dark:text-white">
      {title ? (
        <p className="text-sm font-medium text-piertwo-text">{title}</p>
      ) : (
        <Skeleton className="h-4 w-24 bg-slate-50" />
      )}

      <div className="flex flex-grow flex-col justify-end gap-y-1">
        {body ? (
          <div className="text-2xl font-bold text-piertwoDark-text">{body}</div>
        ) : (
          <Skeleton className="h-8 w-32 bg-slate-50" />
        )}
        {subtext ? (
          <p className="text-xs text-piertwo-text">{subtext}</p>
        ) : (
          <Skeleton className="mt-1 h-3 w-20 bg-slate-50" />
        )}
      </div>
    </div>
  );
};
