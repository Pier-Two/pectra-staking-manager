import { SUPPORTED_CHAINS } from "pec/constants/chain";
import { connect } from "pec/server/database/models";
import { processAllRequestsOnNetwork } from "pec/server/helpers/process-requests/process-all";
import { IResponse } from "pec/types/response";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { logger } from "pec/server/helpers/logger";

async function processHandler(_request: Request) {
  await connect();

  logger.info("Processing Upstash request...");

  const responses: IResponse[] = [];
  for (const chain of SUPPORTED_CHAINS) {
    const response = await processAllRequestsOnNetwork(chain.id);

    responses.push(response);
  }

  const failedResponses = responses.filter((response) => !response.success);

  if (failedResponses.length === 0) {
    logger.info("All Upstash requests processed successfully");

    return Response.json({
      success: true,
      message: "Withdrawal job executed successfully",
    });
  } else {
    logger.error(
      `Error processing Upstash request. Failed responses: ${JSON.stringify(
        failedResponses,
        null,
        2,
      )}`,
    );

    return Response.json(JSON.stringify(failedResponses, null, 2), {
      status: 500,
    });
  }
}

export const POST = verifySignatureAppRouter(processHandler);

export async function GET() {
  return Response.json({ status: "Healthy" });
}
