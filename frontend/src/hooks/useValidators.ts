import { api } from "pec/trpc/react";
import { useWalletAddress } from "./useWallet";
import { useActiveChainWithDefault } from "./useChain";
import { groupBy } from "lodash";
import { useMemo } from "react";
import { validatorIsActive } from "pec/lib/utils/validators/status";
import { ValidatorStatus } from "pec/types/validator";
import { groupValidatorsByWithdrawalPrefix } from "pec/lib/utils/validators/withdrawalAddress";
import { TYPE_2_PREFIX } from "pec/constants/pectra";

export const useValidators = () => {
  const walletAddress = useWalletAddress();
  const chain = useActiveChainWithDefault();

  const queryFn = api.validators.getValidators.useQuery(
    {
      address: walletAddress,
      chainId: chain.id,
    },
    {
      enabled: !!walletAddress,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
  );

  const groupedValidators = useMemo(() => {
    return groupBy(queryFn.data, (validator) => {
      if (validatorIsActive(validator)) return ValidatorStatus.ACTIVE;

      return validator.status;
    });
  }, [queryFn.data]);

  // This the subset of validators that is valid for the withdrawal and deposit flows
  const activeType2Validators =
    groupValidatorsByWithdrawalPrefix(
      groupedValidators[ValidatorStatus.ACTIVE] ?? [],
    )[TYPE_2_PREFIX] ?? [];

  return {
    data: queryFn.data,
    /**
     * @deprecated use isSuccess instead
     */
    isFetched: queryFn.isFetched,
    isSuccess: queryFn.isSuccess,
    isLoading: queryFn.isLoading,
    isError: queryFn.isError,
    groupedValidators,
    activeType2Validators,
  };
};
