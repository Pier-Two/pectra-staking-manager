import { ValidatorCardWrapper } from "pec/components/ui/custom/validator-card-wrapper";
import {
  DisplayAmount,
  ValidatorIndex,
  WithdrawalCredentials,
} from "pec/components/ui/table/TableComponents";
import { type ValidatorDetails } from "pec/types/validator";
import type { FC } from "react";

export interface IValidatorCard {
  validator: ValidatorDetails;
  onClick?: () => void;
}

export const ValidatorCard: FC<IValidatorCard> = (props) => {
  const { validator, onClick } = props;

  return (
    <ValidatorCardWrapper onClick={onClick} isSelected>
      <ValidatorIndex validator={validator} />
      <WithdrawalCredentials validator={validator} />
      <DisplayAmount amount={validator.balance} />
    </ValidatorCardWrapper>
  );
};
