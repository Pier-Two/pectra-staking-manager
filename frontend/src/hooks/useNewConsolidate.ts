import { useRouter } from "next/navigation";
import {
  CONSOLIDATION_STEP_NUMBER_TO_NAME,
  CONSOLIDATION_STEPS,
  ConsolidationWorkflowStages,
} from "pec/types/consolidation";
import { ValidatorDetails } from "pec/types/validator";
import { useImmer } from "use-immer";

interface UseConsolidate {
  activeValidators: ValidatorDetails[];
}

export const useNewConsolidate = ({ activeValidators }: UseConsolidate) => {
  const router = useRouter();

  const [stage, setStage] = useImmer<ConsolidationWorkflowStages>({
    stage: "destination",
  });

  const reset = () => {
    setStage({ stage: "destination" });
  };

  const getAvailableSourceValidators = () => {
    if (stage.stage !== "destination") {
      return activeValidators.filter(
        (v) => v.validatorIndex !== stage.destination.validatorIndex,
      );
    }

    return activeValidators;
  };

  const goToSelectSourceValidators = (validator: ValidatorDetails) => {
    if (stage.stage !== "destination") {
      console.error("Invalid state", stage);
    }

    // We can't reuse getAvailableSourceValidators here because its state won't have updated yet
    const sourceValidators = activeValidators.filter(
      (v) => v.validatorIndex !== validator.validatorIndex,
    );

    setStage({
      stage: "source",
      destination: validator,
      source: sourceValidators,
    });
  };

  const setSourceValidator = (
    validator: ValidatorDetails | ValidatorDetails[],
  ) => {
    setStage((state) => {
      if (state.stage !== "source") {
        console.error("Invalid state", stage);

        // TODO: How to handle this?
        return;
      }

      if (Array.isArray(validator)) {
        state.source = validator;
        return;
      }

      const index = state.source.findIndex(
        (v) => v.validatorIndex === validator.validatorIndex,
      );

      if (index === -1) {
        state.source.push(validator);
      } else {
        state.source.splice(index, 1);
      }
    });
  };

  const goToSummary = () => {
    setStage((state) => {
      if (stage.stage !== "source") {
        console.error("Invalid state", stage);

        return;
      }

      state.stage = "summary";
    });
  };

  const goToSubmit = () => {
    setStage((state) => {
      if (stage.stage !== "summary") {
        console.error("Invalid state", stage);

        return;
      }

      state.stage = "submit";
    });
  };

  const goBack = () => {
    const currentStep = CONSOLIDATION_STEPS[stage.stage];
    if (currentStep === 2) {
      reset();
    } else {
      setStage((state) => {
        // Each previous state has everything it needs, so we don't need to complicate this and can just deduct
        state.stage = CONSOLIDATION_STEP_NUMBER_TO_NAME[currentStep - 1]!;
      });
    }
  };

  return {
    stage,
    setSourceValidator,
    goToSelectSourceValidators,
    goToSummary,
    goToSubmit,
    goBack,
    reset,
    getAvailableSourceValidators,
  };
};
