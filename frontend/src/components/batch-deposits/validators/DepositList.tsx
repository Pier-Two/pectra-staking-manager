import type { FC } from "react";
import type { IDepositList } from "pec/types/batch-deposits";
import { ValidatorListHeaders } from "./ValidatorListHeaders";
import { DepositSignDataCard } from "pec/components/validators/cards/DepositSignDataCard";

export const DepositList: FC<IDepositList> = (props) => {
  const { deposits } = props;

  return (
    <>
      <div className="text-lg">Deposits</div>
      <ValidatorListHeaders labels={["Validator", "Deposit", "Deposit Data"]} />
      {deposits.map((deposit) => (
        <DepositSignDataCard
          key={deposit.validator.validatorIndex}
          deposit={deposit}
        />
      ))}
    </>
  );
};
