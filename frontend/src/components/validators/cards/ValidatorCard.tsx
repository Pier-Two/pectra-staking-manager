import { ValidatorCardWrapper } from "pec/components/ui/custom/validator-card-wrapper";
import {
  DisplayAmount,
  ValidatorIndex,
  WithdrawalAddress,
} from "pec/components/ui/table/TableComponents";
import { ValidatorDetails } from "pec/types/validator";
import type { FC } from "react";

export interface IValidatorCard {
  validator: ValidatorDetails;
  onClick?: () => void;
  className?: string;
}

export const ValidatorCard: FC<IValidatorCard> = (props) => {
  const { validator, onClick, className } = props;

  return (
    <ValidatorCardWrapper
      onClick={onClick}
      className={className}
      clearBackground
    >
      <ValidatorIndex validator={validator} />
      <WithdrawalAddress validator={validator} />
      <DisplayAmount amount={validator.balance} />
    </ValidatorCardWrapper>
  );
};
