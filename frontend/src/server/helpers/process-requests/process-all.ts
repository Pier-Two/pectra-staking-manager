import { SupportedNetworkIds } from "pec/constants/chain";
import { processExits } from "./exits";
import { processConsolidations } from "./consolidation";
import { processValidatorUpgrades } from "./validatorUpgrade";
import { processDeposits } from "./deposit";
import { IResponse } from "pec/types/response";

export const processAllRequestsOnNetwork = async (
  networkId: SupportedNetworkIds,
): Promise<IResponse> => {
  let response: IResponse = { success: true, data: null };

  const handleResponse = (res: IResponse) => {
    if (!res.success) {
      if (response.success) {
        response = {
          success: false,
          error: `Request failed on network: ${networkId}. ${res.error}`,
        };
      } else {
        // If there's already an error, append the new one
        response.error = `${response.error}, ${res.error}`;
      }
    }
  };

  handleResponse(await processExits({ networkId }));

  handleResponse(await processConsolidations({ networkId }));

  handleResponse(await processValidatorUpgrades({ networkId }));

  handleResponse(await processDeposits({ networkId }));

  // TODO: call withdrawals

  return response;
};
