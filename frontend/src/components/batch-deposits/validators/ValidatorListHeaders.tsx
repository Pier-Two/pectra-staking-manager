import type { FC } from "react";
import { ColumnHeader } from "./ColumnHeader";
import type { IValidatorListHeaders } from "pec/types/batch-deposits";

export const ValidatorListHeaders: FC<IValidatorListHeaders> = (props) => {
  const { labels } = props;

  return (
    <div className="flex w-full items-center px-4">
      {labels.map((label, index) => (
        <div key={label} className={`flex-1 ${index === 0 ? "flex-[1.2]" : ""}`} >
          <ColumnHeader key={label} label={label} showSort />
        </div>
      ))}
    </div>
  );
};
