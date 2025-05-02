import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { SUPPORTED_CHAINS } from "pec/constants/chain";
import { processAllRequestsOnNetwork } from "pec/server/helpers/process-requests/process-all";
import { IResponse } from "pec/types/response";

async function processHandler(_request: Request) {
  const responses: IResponse[] = [];
  for (const chain of SUPPORTED_CHAINS) {
    const response = await processAllRequestsOnNetwork(chain.id);

    responses.push(response);
  }

  const failedResponses = responses.filter((response) => !response.success);

  if (failedResponses.length === 0) {
    return Response.json({
      success: true,
      message: "Withdrawal job executed successfully",
    });
  } else {
    return Response.json(JSON.stringify(failedResponses, null, 2), {
      status: 500,
    });
  }
}

export const POST = verifySignatureAppRouter(processHandler);

export async function GET() {
  return Response.json({ status: "Healthy" });
}
