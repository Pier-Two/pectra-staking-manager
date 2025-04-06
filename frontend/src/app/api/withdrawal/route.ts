import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { processWithdrawals } from "pec/server/api/routers/store-email-request/withdrawal";

async function withdrawalHandler(_request: Request) {
  console.log("Log for Vercel deployment - withdrawalHandler HIT");
  const result = await processWithdrawals();
  console.log("Log for Vercel deployment - result: ", result);
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
