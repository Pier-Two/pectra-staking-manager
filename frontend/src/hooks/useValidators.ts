import { api } from "pec/trpc/react";
import { useWalletAddress } from "./useWallet";
import { useActiveChainWithDefault } from "./useChain";
import { groupBy } from "lodash";
import { useMemo } from "react";
import { validatorIsActive } from "pec/lib/utils/validators/status";
import { ValidatorStatus } from "pec/types/validator";

export const useValidators = () => {
  const walletAddress = useWalletAddress();
  const chain = useActiveChainWithDefault();

  const queryFn = api.validators.getValidators.useQuery(
    {
      address: walletAddress,
      chainId: chain.id,
    },
    { enabled: !!walletAddress },
  );

  const groupedValidators = useMemo(() => {
    return groupBy(queryFn.data, (validator) => {
      if (validatorIsActive(validator)) return ValidatorStatus.ACTIVE;

      return validator.status;
    });
  }, [queryFn.data]);

  return {
    data: queryFn.data,
    isFetched: queryFn.isFetched,
    isLoading: queryFn.isLoading,
    isError: queryFn.isError,
    groupedValidators,
  };
};
