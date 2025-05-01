import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { MAIN_CHAIN } from "pec/lib/constants/contracts";
import { processConsolidations } from "pec/server/helpers/process-requests/consolidation";

async function consolidationHandler(_request: Request) {
  const result = await processConsolidations(MAIN_CHAIN.id);
  if (result.success) {
    return Response.json({
      success: true,
      message: "Consolidation job executed successfully",
    });
  } else {
    return Response.json(result, { status: 500 });
  }
}

export const POST = verifySignatureAppRouter(consolidationHandler);

export async function GET() {
  return Response.json({ status: "Healthy" });
}
