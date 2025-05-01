import type { FC } from "react";

import { ValidatorCardWrapper } from "pec/components/ui/custom/validator-card-wrapper";
import {
  DisplayAmount,
  ValidatorIndex,
  WithdrawalAddress,
} from "pec/components/ui/table/TableComponents";
import { type ValidatorDetails } from "pec/types/validator";

export interface IValidatorCard {
  validator: ValidatorDetails;
  onClick?: () => void;
}

export const ValidatorCard: FC<IValidatorCard> = (props) => {
  const { validator, onClick } = props;

  return (
    <ValidatorCardWrapper onClick={onClick} isSelected>
      <ValidatorIndex validator={validator} />
      <WithdrawalAddress validator={validator} />
      <DisplayAmount amount={validator.balance} />
    </ValidatorCardWrapper>
  );
};
