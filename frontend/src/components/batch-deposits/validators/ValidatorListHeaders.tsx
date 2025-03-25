import type { FC } from "react";
import { ColumnHeader } from "./ColumnHeader";
import type { IValidatorListHeaders } from "pec/types/batch-deposits";

export const ValidatorListHeaders: FC<IValidatorListHeaders> = (props) => {
  const { labels } = props;

  return (
    <div className="flex-col-3 flex w-full justify-between">
      {labels.map((label) => (
        <ColumnHeader key={label} label={label} showSort />
      ))}
    </div>
  );
};
