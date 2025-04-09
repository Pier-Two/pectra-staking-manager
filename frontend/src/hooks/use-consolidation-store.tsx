"use client";

import { TransactionStatus, type ValidatorDetails } from "pec/types/validator";

import { useStore } from "zustand";
import { persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

// zustand doesnt writing bigints
const serializeValidator = (validator: ValidatorDetails) => {
  const formatted = {
    ...validator,
    balance: validator.balance.toString(),
    effectiveBalance: validator.effectiveBalance.toString(),
  };

  return formatted;
};

// Create a type for the serialized validator
type SerializedValidator = ReturnType<typeof serializeValidator>;

const deserialiseValidator = (validator: SerializedValidator) => {
  return {
    ...validator,
    balance: BigInt(validator.balance),
    effectiveBalance: BigInt(validator.effectiveBalance),
  };
};

type ConsolidationStore = {
  progress: number;
  setProgress: (step: number) => void;

  consolidationTarget: SerializedValidator | undefined;
  setConsolidationTarget: (validator: ValidatorDetails | undefined) => void;

  validatorsToConsolidate: SerializedValidator[];
  bulkSetConsolidationTargets: (validators: ValidatorDetails[]) => void;
  addValidatorToConsolidate: (validator: ValidatorDetails) => void;
  removeValidatorToConsolidate: (validator: ValidatorDetails) => void;
  updateConsolidatedValidator: (
    validator: ValidatorDetails,
    txHash: string,
  ) => void;

  // Email fields
  summaryEmail: string;
  setSummaryEmail: (email: string) => void;
  consolidationEmail: string;
  setConsolidationEmail: (email: string) => void;

  // Reset method
  reset: () => void;

  // Getter methods to deserialize data
  getConsolidationTarget: () => ValidatorDetails | undefined;
  getValidatorsToConsolidate: () => ValidatorDetails[];
};

export const consolidationStore = createStore<ConsolidationStore>()(
  persist(
    (set, get) => ({
      progress: 1,
      setProgress: (progress: number) => set({ progress }),

      consolidationTarget: undefined,
      setConsolidationTarget: (validator: ValidatorDetails | undefined) =>
        set({
          consolidationTarget: validator
            ? serializeValidator(validator)
            : undefined,
        }),

      validatorsToConsolidate: [],
      bulkSetConsolidationTargets: (validators: ValidatorDetails[]) =>
        set(() => ({
          validatorsToConsolidate: validators.map(serializeValidator),
        })),

      addValidatorToConsolidate: (validator: ValidatorDetails) =>
        set(() => ({
          validatorsToConsolidate: [
            ...get().validatorsToConsolidate,
            serializeValidator(validator),
          ],
        })),

      removeValidatorToConsolidate: (validator: ValidatorDetails) =>
        set((state) => ({
          validatorsToConsolidate: state.validatorsToConsolidate.filter(
            (v) => v.publicKey !== validator.publicKey,
          ),
        })),

      updateConsolidatedValidator: (
        validator: ValidatorDetails,
        txHash: string,
      ) =>
        set((state) => ({
          validatorsToConsolidate: state.validatorsToConsolidate.map((v) =>
            v.publicKey === validator.publicKey
              ? {
                  ...v,
                  depositTransaction: {
                    hash: txHash,
                    status: TransactionStatus.SUBMITTED,
                  },
                }
              : v,
          ),
        })),

      // Email fields implementation
      summaryEmail: "",
      setSummaryEmail: (email: string) => set({ summaryEmail: email }),
      consolidationEmail: "",
      setConsolidationEmail: (email: string) =>
        set({ consolidationEmail: email }),

      // Reset method implementation
      reset: () =>
        set({
          progress: 1,
          consolidationTarget: undefined,
          validatorsToConsolidate: [],
          summaryEmail: "",
          consolidationEmail: "",
        }),

      // Getter methods to deserialize data
      getConsolidationTarget: () => {
        const target = get().consolidationTarget;
        return target ? deserialiseValidator(target) : undefined;
      },
      getValidatorsToConsolidate: () => {
        return get().validatorsToConsolidate.map(deserialiseValidator);
      },
    }),
    {
      name: "consolidation-store",
    },
  ),
);

// Custom hook to return deserialized data
export const useConsolidationStore = () => {
  const store = useStore(consolidationStore);

  return {
    ...store,
    consolidationTarget: store.getConsolidationTarget(),
    validatorsToConsolidate: store.getValidatorsToConsolidate(),
  };
};
