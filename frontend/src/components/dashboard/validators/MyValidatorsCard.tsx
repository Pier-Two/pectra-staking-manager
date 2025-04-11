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
    <div className="flex h-[125px] flex-col space-y-3 rounded-xl bg-[#F1F3FF] p-6 dark:bg-gray-900 dark:text-white">
      <p className="text-[14px] font-medium leading-[14px] text-[#4C4C4C]">
        {title}
      </p>

      {/*
         // TODO: Positioning of this is still slightly off
        */}
      <div className="flex flex-grow flex-col justify-end gap-y-1">
        <div className="text-[24px] font-bold leading-[29px] text-primary-dark">
          {body}
        </div>
        {!!subtext ? (
          <p className="text-[12px] leading-[12px] text-[#4C4C4C]">{subtext}</p>
        ) : (
          <div className="h-3" />
        )}
      </div>
    </div>
  );
};
