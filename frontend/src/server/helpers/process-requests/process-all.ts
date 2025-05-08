import { SupportedNetworkIds } from "pec/constants/chain";
import { processExits } from "./exits";
import { processConsolidations } from "./consolidation";
import { processValidatorUpgrades } from "./validatorUpgrade";
import { processDeposits } from "./deposit";
import { IResponse } from "pec/types/response";
import { processPartialWithdrawals } from "./withdrawal";
import { logger } from "../logger";

export const processAllRequestsOnNetwork = async (
  networkId: SupportedNetworkIds,
): Promise<IResponse> => {
  logger.info(`Processing all requests on network: ${networkId}...`);
  let response: IResponse = { success: true, data: null };

  const handleResponse = (requestName: string, res: IResponse) => {
    if (!res.success) {
      logger.error(
        `Error processing ${requestName} on network: ${networkId}. ${res.error}`,
      );

      if (response.success) {
        response = {
          success: false,
          error: `${requestName} failed on network: ${networkId}. ${res.error}`,
        };
      } else {
        // If there's already an error, append the new one
        response.error = `${response.error}, ${res.error}`;
      }
    }
  };

  logger.info(`Processing exits...`);
  handleResponse("exits", await processExits({ networkId }));

  logger.info(`Processing consolidations...`);
  handleResponse("consolidations", await processConsolidations({ networkId }));

  logger.info(`Processing validator upgrades...`);
  handleResponse(
    "validator upgrades",
    await processValidatorUpgrades({ networkId }),
  );

  logger.info(`Processing deposits...`);
  handleResponse("deposits", await processDeposits({ networkId }));

  logger.info(`Processing partial withdrawals...`);
  handleResponse(
    "partial withdrawals",
    await processPartialWithdrawals({ networkId }),
  );

  return response;
};
