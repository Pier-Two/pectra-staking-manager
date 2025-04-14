import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { processConsolidations } from "pec/server/api/routers/store-email-request/consolidation";

async function consolidationHandler(_request: Request) {
  // TODO:
  const result = await processConsolidations(1, "");
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
