import { DECIMAL_PLACES } from "pec/lib/constants";
import type { IGenericValidators } from "pec/types/validator";
import type { FC } from "react";
import { formatEther } from "viem";
import { MyValidatorsCard } from "./MyValidatorsCard";

export const TotalStake: FC<IGenericValidators> = (props) => {
  const { validators } = props;
  const totalStake = validators.reduce(
    (acc, validator) => acc + validator.balance,
    0n,
  );
  const averageStake = totalStake / BigInt(validators.length);

  return (
    <MyValidatorsCard
      title="Total ETH Staked"
      body={<p>Ξ {Number(formatEther(totalStake)).toFixed(DECIMAL_PLACES)}</p>}
      subtext={`Average ${Number(formatEther(averageStake)).toFixed(DECIMAL_PLACES)} per validator`}
    />
  );
};
