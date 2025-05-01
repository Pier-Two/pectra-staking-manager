"use client";

import Image from "next/image";

import { Skeleton } from "pec/components/ui/skeleton";
import { dashboardAnimationDelays } from "pec/constants/animationDelays";
import { useValidators } from "pec/hooks/useValidators";
import { ValidatorStatus } from "pec/types/validator";

import { MyValidatorsCard } from "./MyValidatorsCard";

export const ActiveValidators = () => {
  const { data: validators, groupedValidators } = useValidators();

  const activeValidators = groupedValidators[ValidatorStatus.ACTIVE] ?? [];

  const inactiveValidators = validators
    ? validators.length - activeValidators.length
    : null;

  if (inactiveValidators === null)
    return (
      <MyValidatorsCard
        isLoading
        delay={dashboardAnimationDelays.activeValidators}
        layoutId="active-validators-card"
        title="Active Validators"
        body={
          <div className="flex flex-row items-center gap-x-2">
            <Image
              src="/icons/EthValidator.svg"
              alt="Wallet"
              width={24}
              height={24}
            />
            <Skeleton className="h-8 w-16 bg-slate-50" />
          </div>
        }
      />
    );

  return (
    <MyValidatorsCard
      layoutId="active-validators-card"
      title="Active Validators"
      body={
        <div className="flex flex-row items-center gap-x-2">
          <Image
            src="/icons/EthValidator.svg"
            alt="Wallet"
            width={24}
            height={24}
          />
          <div>{activeValidators.length}</div>
        </div>
      }
      subtext={inactiveValidators ? `+${inactiveValidators} inactive` : ""}
    />
  );
};
