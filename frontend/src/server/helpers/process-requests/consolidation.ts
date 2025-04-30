import { type AxiosResponse } from "axios";
import { ConsolidationModel } from "pec/lib/database/models";
import { generateErrorResponse } from "pec/lib/utils";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";
import type { IResponse } from "pec/types/response";
import { env } from "pec/env";
import { z } from "zod";
import { BEACONCHAIN_OK_STATUS } from "pec/lib/constants";
import { sendEmailNotification } from "pec/lib/services/emailService";
import { getBeaconChainAxios } from "pec/lib/server/axios";
import { MAIN_CHAIN } from "pec/lib/constants/contracts";

const ConsolidationDataSchema = z.object({
  activationeligibilityepoch: z.number(),
  activationepoch: z.number(),
  balance: z.number(),
  effectivebalance: z.number(),
  exitepoch: z.number(),
  lastattestationslot: z.number(),
  name: z.string(),
  pubkey: z.string(),
  slashed: z.boolean(),
  status: z.string(),
  validatorindex: z.number(),
  withdrawableepoch: z.number(),
  withdrawalcredentials: z.string(),
  total_withdrawals: z.number(),
});

const ConsolidationResponseSchema = z.object({
  status: z.literal(BEACONCHAIN_OK_STATUS),
  data: ConsolidationDataSchema,
});

type ConsolidationResponse = z.infer<typeof ConsolidationResponseSchema>;
type ConsolidationData = z.infer<typeof ConsolidationDataSchema>;

const ACTIVE_CHECK = "active";
const EXITED_CHECK = "exited";

export const processConsolidations = async (): Promise<IResponse> => {
  try {
    const consolidations = await ConsolidationModel.find({
      status: ACTIVE_STATUS,
    });

    if (!consolidations)
      return {
        success: false,
        error: "Consolidation query failed to execute.",
      };

    if (consolidations.length === 0)
      return {
        success: true,
        data: null,
      };

    for (const consolidation of consolidations) {
      const {
        sourceTargetValidatorIndex,
        txHash,
        email: usersEmail,
      } = consolidation;

      const response = await getBeaconChainAxios(MAIN_CHAIN.id).get(
        `/api/v1/validator/${sourceTargetValidatorIndex}?apikey=${env.BEACONCHAIN_API_KEY}`,
      );

      if (!isResponseValid(response)) {
        console.error(
          "Invalid response from BeaconChain API:",
          response.status,
        );
        continue;
      }
      const consolidationData = response.data.data;

      const consolidated = isConsolidationProcessed(consolidationData);
      if (!consolidated) continue;

      if (usersEmail) {
        const email = await sendEmailNotification(
          "PECTRA_STAKING_MANAGER_CONSOLIDATION_COMPLETE",
          usersEmail,
        );

        if (!email.success) {
          console.error("Error sending email notification:", email.error);
          continue;
        }
      }

      await ConsolidationModel.updateOne(
        { sourceTargetValidatorIndex, txHash },
        { $set: { status: INACTIVE_STATUS } },
      );
    }

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    return generateErrorResponse(error);
  }
};

const isResponseValid = (
  response: AxiosResponse<ConsolidationResponse>,
): boolean => {
  if (!response || response.status !== 200) return false;
  const result = ConsolidationResponseSchema.safeParse(response.data);
  return result.success;
};

const isConsolidationProcessed = (
  validatorData: ConsolidationData,
): boolean => {
  // A consolidation is processed when:
  // 1. Balance is 0
  // 2. Status is "exited" (not active)
  if (validatorData.balance > 0) return false;
  if (validatorData.status.toLowerCase().includes(ACTIVE_CHECK)) return false;
  if (
    validatorData.balance === 0 &&
    validatorData.status.toLowerCase().includes(EXITED_CHECK)
  )
    return true;
  return false;
};
