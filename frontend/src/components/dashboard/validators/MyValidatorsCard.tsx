import { type ReactNode } from "react";

type MyValidatorsCardProps = {
  title: string;
  body: ReactNode;
  subtext: string;
};

export const MyValidatorsCard = ({
  title,
  body,
  subtext,
}: MyValidatorsCardProps) => {
  return (
    <div className="flex h-32 flex-col space-y-3 rounded-xl bg-indigo-50 p-6 dark:bg-gray-950 dark:text-white">
      <p className="text-piertwo-text text-sm font-medium">{title}</p>

      <div className="flex flex-grow flex-col justify-end gap-y-1">
        <div className="text-piertwoDark-text text-2xl font-bold">{body}</div>
        {!!subtext ? (
          <p className="text-piertwo-text text-xs">{subtext}</p>
        ) : (
          <div className="h-3" />
        )}
      </div>
    </div>
  );
};
