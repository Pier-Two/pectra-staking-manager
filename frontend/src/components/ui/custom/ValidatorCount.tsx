import { useValidators } from "pec/hooks/useValidators";
import { PectraSpinner } from "./pectraSpinner";
import { ValidatorStatus } from "pec/types/validator";

export const ValidatorCount = () => {
  const { groupedValidators, isLoading: validatorsLoading } = useValidators();

  return validatorsLoading ? (
    <PectraSpinner />
  ) : (
    <div className="relative flex h-6 w-6 items-center justify-center bg-transparent">
      <div
        className="absolute inset-0 rounded-[3px] p-[1px]"
        style={{
          background:
            "linear-gradient(130.54deg, #00FFA7 11.34%, #5164DC 31.73%, #313C86 59.22%, rgba(113, 255, 224, 0.8) 100%)",
          mask: "linear-gradient(white 0 0) content-box, linear-gradient(white 0 0)",
          maskComposite: "exclude",
        }}
      />
      <p className="relative font-inter text-sm font-medium text-black dark:text-zinc-50">
        {groupedValidators[ValidatorStatus.ACTIVE]?.length ?? 0}
      </p>
    </div>
  );
};
