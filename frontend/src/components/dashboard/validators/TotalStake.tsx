import { MyValidatorsCard } from "./MyValidatorsCard";
import { displayedEthAmount } from "pec/lib/utils/validators/balance";
import { ValidatorDetails } from "pec/types/validator";

interface TotalStakeProps {
  validators: ValidatorDetails[];
}

export const TotalStake = (props: TotalStakeProps) => {
  const { validators } = props;
  const totalStake = validators.reduce(
    (acc, validator) => acc + validator.balance,
    0,
  );
  const averageStake =
    validators.length > 0 ? totalStake / validators.length : 0n;

  return (
    <MyValidatorsCard
      title="Total ETH Staked"
      body={<p>Ξ {displayedEthAmount(totalStake)}</p>}
      subtext={`Average ${displayedEthAmount(averageStake)} per validator`}
    />
  );
};
