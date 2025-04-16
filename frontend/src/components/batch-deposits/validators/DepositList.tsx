import { ValidatorListHeaders } from "./ValidatorListHeaders";
import { DistributionInformation } from "../distribution/DistributionInformation";
import { DepositSignDataCard } from "pec/components/validators/cards/DepositSignDataCard";
import { SIGN_DEPOSIT_COLUMN_HEADERS } from "pec/constants/columnHeaders";
import { DepositData } from "pec/lib/api/schemas/deposit";

export interface IDepositList {
  deposits: DepositData[];
  resetBatchDeposit: () => void;
  totalAllocated: number;
  totalToDistribute: number;
}

export const DepositList = ({
  deposits,
  resetBatchDeposit,
  totalAllocated,
  totalToDistribute,
}: IDepositList) => {
  return (
    <>
      <DistributionInformation
        buttonText="Submitting"
        disableButton={false}
        resetBatchDeposit={resetBatchDeposit}
        stage={"transactions-submitted"}
        totalAllocated={totalAllocated}
        totalToDistribute={totalToDistribute}
        numDeposits={deposits.length}
      />

      <div className="text-md font-medium">Deposits</div>

      <div className="flex flex-col gap-3">
        <ValidatorListHeaders
          columnHeaders={SIGN_DEPOSIT_COLUMN_HEADERS}
          sortColumn={""}
          sortDirection={null}
          onSort={() => {}}
        />

        {deposits.map((deposit, index) => {
          return (
            <DepositSignDataCard
              key={`deposit-${index}-${deposit.validator.validatorIndex}`}
              deposit={deposit}
            />
          );
        })}
      </div>
    </>
  );
};
