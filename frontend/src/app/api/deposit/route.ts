import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { processDeposits } from "pec/server/helpers/process-requests/deposit";

async function depositHandler(_request: Request) {
  const result = await processDeposits();
  if (result.success) {
    return Response.json({
      success: true,
      message: "Deposit job executed successfully",
    });
  } else {
    return Response.json(result, { status: 500 });
  }
}

export const POST = verifySignatureAppRouter(depositHandler);

export async function GET() {
  return Response.json({ status: "Healthy" });
}
