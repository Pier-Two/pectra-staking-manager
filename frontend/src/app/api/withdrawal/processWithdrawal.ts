import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { MAIN_CHAIN } from "pec/lib/constants/contracts";
import { processWithdrawals } from "pec/server/helpers/process-requests/withdrawal";

async function withdrawalHandler(_request: Request) {
  const result = await processWithdrawals(MAIN_CHAIN.id);
  if (result.success) {
    return Response.json({
      success: true,
      message: "Deposit job executed successfully",
    });
  } else {
    return Response.json(result, { status: 500 });
  }
}

export const POST = verifySignatureAppRouter(withdrawalHandler);

export async function GET() {
  return Response.json({ status: "Healthy" });
}
