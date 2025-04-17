import { DepositSignDataCard } from "pec/components/validators/cards/DepositSignDataCard";
import { SIGN_DEPOSIT_COLUMN_HEADERS } from "pec/constants/columnHeaders";
import { type DepositData } from "pec/lib/api/schemas/deposit";
import { type DepositWorkflowStage } from "pec/types/batch-deposits";
import { DistributionInformation } from "../distribution/DistributionInformation";
import { ValidatorListHeaders } from "./ValidatorListHeaders";

export interface IDepositList {
  deposits: DepositData[];
  resetBatchDeposit: () => void;
  totalAllocated: number;
  totalToDistribute: number;
  stage: DepositWorkflowStage;
}

export const DepositList = ({
  deposits,
  resetBatchDeposit,
  totalAllocated,
  totalToDistribute,
  stage,
}: IDepositList) => {
  return (
    <>
      <DistributionInformation
        resetBatchDeposit={resetBatchDeposit}
        stage={stage}
        totalAllocated={totalAllocated}
        totalToDistribute={totalToDistribute}
        numDeposits={deposits.length}
      />

      <div className="text-md font-medium">Deposits</div>

      <div className="flex flex-col gap-3">
        <ValidatorListHeaders
          columns={SIGN_DEPOSIT_COLUMN_HEADERS}
          sortColumn={""}
          sortDirection={null}
          onSort={() => {}}
        />

        {deposits.map((deposit, index) => {
          return (
            <DepositSignDataCard
              key={`deposit-${index}-${deposit.validator.validatorIndex}`}
              deposit={deposit}
              stage={stage}
            />
          );
        })}
      </div>
    </>
  );
};
