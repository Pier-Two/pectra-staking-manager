import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";

import { processWithdrawals } from "./processWithdrawal";

async function withdrawalHandler(_request: Request) {
  const result = await processWithdrawals();
  if (result.success) {
    return Response.json({
      success: true,
      message: "Withdrawal job executed successfully",
    });
  } else {
    return Response.json(result, { status: 500 });
  }
}

export const POST = verifySignatureAppRouter(withdrawalHandler);

export async function GET() {
  return Response.json({ status: "Healthy" });
}
