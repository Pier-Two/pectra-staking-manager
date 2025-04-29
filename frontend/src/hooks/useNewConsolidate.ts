import {
  CONSOLIDATION_STEP_NUMBER_TO_NAME,
  CONSOLIDATION_STEPS,
  type ConsolidationWorkflowStages,
} from "pec/types/consolidation";
import { type ValidatorDetails } from "pec/types/validator";
import { useImmer } from "use-immer";
import { useSubmitConsolidate } from "./use-consolidation";
import { getRequiredConsolidationTransactions } from "pec/lib/utils/validators/consolidate";
import { TransactionStatus } from "pec/types/withdraw";

interface UseConsolidate {
  activeValidators: ValidatorDetails[];
}

export const useNewConsolidate = ({ activeValidators }: UseConsolidate) => {
  const consolidate = useSubmitConsolidate();

  const [stage, setStage] = useImmer<ConsolidationWorkflowStages>({
    stage: "destination",
  });

  const reset = () => {
    setStage({ stage: "destination" });
  };

  const getAvailableSourceValidators = () => {
    if (stage.stage !== "destination") {
      return activeValidators.filter(
        (v) => v.validatorIndex !== stage.destinationValidator.validatorIndex,
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
      destinationValidator: validator,
      sourceValidator: sourceValidators,
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
        state.sourceValidator = validator;
        return;
      }

      const index = state.sourceValidator.findIndex(
        (v) => v.validatorIndex === validator.validatorIndex,
      );

      if (index === -1) {
        state.sourceValidator.push(validator);
      } else {
        state.sourceValidator.splice(index, 1);
      }
    });
  };

  const goToSummary = () => {
    if (stage.stage !== "source") {
      console.error("Invalid state", stage);

      return;
    }

    const updatedStage: ConsolidationWorkflowStages = {
      stage: "summary",
      destinationValidator: stage.destinationValidator,
      sourceValidator: stage.sourceValidator,
      transactions: getRequiredConsolidationTransactions(
        stage.destinationValidator,
        stage.sourceValidator,
      ),
    };

    setStage(updatedStage);
  };

  const updateTransactionStatus = (
    index: number,
    status: TransactionStatus,
  ) => {
    setStage((state) => {
      if (state.stage !== "submit") {
        console.error("Invalid state", stage);

        return;
      }

      if (!state.transactions.transactions[index]) {
        console.error("Transaction not found", index, state);

        return;
      }

      state.transactions.transactions[index].transactionStatus = status;
    });
  };

  const goToSubmit = async () => {
    if (stage.stage !== "summary") {
      console.error("Invalid state", stage);

      return;
    }

    const updatedStage: ConsolidationWorkflowStages = {
      stage: "submit",
      destinationValidator: stage.destinationValidator,
      sourceValidator: stage.sourceValidator,
      // Bit messy but just resets the states to pending if they went through the flow previously
      transactions: {
        ...stage.transactions,
        transactions: stage.transactions.transactions.map((tx) => ({
          ...tx,
          transactionStatus: { status: "pending" },
        })),
      },
    };

    setStage(updatedStage);

    // TODO: EMAIL
    const result = await consolidate(
      updatedStage.destinationValidator,
      updatedStage.transactions.transactions,
      updateTransactionStatus,
      "",
    );

    if (!result) goBack();
  };

  const goBack = () => {
    const currentStep = CONSOLIDATION_STEPS[stage.stage];

    if (currentStep === 1) {
      // Log the error because this is misuse
      console.error("Already at the first step", stage);
      return;
    }

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
