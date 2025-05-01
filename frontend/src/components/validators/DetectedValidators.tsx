"use client";

import type { FC } from "react";
import { useState } from "react";
import Image from "next/image";
import { ChevronsLeftRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { CONSOLIDATION_TABLE_HEADERS } from "pec/constants/columnHeaders";
import { displayedEthAmount } from "pec/lib/utils/validators/balance";
import { validatorIsActive } from "pec/lib/utils/validators/status";
import { type IDetectedValidators } from "pec/types/validator";

import { ValidatorCardWrapper } from "../ui/custom/validator-card-wrapper";
import { ValidatorTable } from "../ui/table/ValidatorTable";

export const DetectedValidators: FC<IDetectedValidators> = (props) => {
  const { cardTitle, validators } = props;

  const activeValidators = validators?.filter((validator) =>
    validatorIsActive(validator),
  );

  const numberOfInactiveValidators =
    validators?.length - activeValidators?.length;

  const [showValidators, setShowValidators] = useState<boolean>(false);

  const totalBalance = validators.reduce(
    (acc, validator) => acc + validator.balance,
    0,
  );

  return (
    <motion.div
      className="flex flex-col gap-y-3"
      animate={{ height: "auto" }}
      transition={{ duration: 1 }}
    >
      <motion.div layoutId={"validators-found-detected-validators"}>
        <ValidatorCardWrapper
          isSelected={showValidators}
          onClick={() => setShowValidators(!showValidators)}
        >
          <div className="flex items-center gap-x-4">
            <Image
              src="/icons/EthValidator.svg"
              alt="Wallet"
              width={24}
              height={24}
            />
            <p className="text-[14px] font-570 leading-[14px] text-zinc-950 dark:text-zinc-50">
              {validators.length} {cardTitle}{" "}
              {numberOfInactiveValidators > 0 &&
                `(${numberOfInactiveValidators} inactive or exiting)`}
            </p>
          </div>

          <div className="flex items-center gap-x-4">
            <div className="flex items-center gap-1">
              <p className="text-[14px] font-570 leading-[14px] text-zinc-950 dark:text-zinc-50">
                Ξ {displayedEthAmount(totalBalance)}
              </p>
            </div>
            <ChevronsLeftRight className="h-4 w-4 rotate-90 text-gray-800 dark:text-white" />
          </div>
        </ValidatorCardWrapper>
      </motion.div>

      {showValidators && (
        <AnimatePresence>
          <ValidatorTable
            data={activeValidators}
            headers={CONSOLIDATION_TABLE_HEADERS}
            wrapperProps={{ clearBackground: true }}
            disablePagination
          />
        </AnimatePresence>
      )}
    </motion.div>
  );
};
