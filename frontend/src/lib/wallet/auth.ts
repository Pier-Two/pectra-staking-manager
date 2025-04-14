"use server";

import { env } from "pec/env";
import { createAuth, VerifyLoginPayloadParams } from "thirdweb/auth";
import { client } from "./client";
import { cookies } from "next/headers";
import { privateKeyToAccount } from "thirdweb/wallets";
import { IResponse } from "pec/types/response";

const thirdwebAuth = createAuth({
  domain: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
  client,
  adminAccount: privateKeyToAccount({
    client,
    privateKey: env.AUTH_JWT_VERIFYING_KEY,
  }),
});

export const generatePayload = thirdwebAuth.generatePayload;

export async function login(payload: VerifyLoginPayloadParams) {
  const verifiedPayload = await thirdwebAuth.verifyPayload(payload);
  if (verifiedPayload.valid) {
    const jwt = await thirdwebAuth.generateJWT({
      payload: verifiedPayload.payload,
      context: {
        user: true,
      },
    });
    (await cookies()).set("jwt", jwt);
  }
}

export async function isLoggedIn(): Promise<
  IResponse<{ address: string; accessToken: string }>
> {
  const jwt = (await cookies()).get("jwt");
  if (!jwt?.value) {
    return { success: false, error: "No JWT found" };
  }

  const authResult = await thirdwebAuth.verifyJWT({ jwt: jwt.value });
  if (authResult.valid) {
    return {
      success: true,
      data: {
        address: authResult.parsedJWT.sub,
        accessToken: jwt.value,
      },
    };
  }
  return { success: false, error: "Invalid JWT" };
}

export async function logout() {
  console.log("Log out");
  (await cookies()).delete("jwt");
}
