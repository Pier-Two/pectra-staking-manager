"use server";

import { env } from "pec/env";
import { createAuth, VerifyLoginPayloadParams } from "thirdweb/auth";
import { client } from "./client";
import { cookies } from "next/headers";
import { privateKeyToAccount } from "thirdweb/wallets";

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
  console.log("Checking login state");
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

export async function isLoggedIn() {
  console.log("tytytytyty");
  const jwt = (await cookies()).get("jwt");
  if (!jwt?.value) {
    return { address: null, accessToken: null, isValid: false };
  }

  const authResult = await thirdwebAuth.verifyJWT({ jwt: jwt.value });
  if (authResult.valid) {
    return {
      address: authResult.parsedJWT.sub,
      accessToken: jwt.value,
      isValid: true,
    };
  }
  return { address: null, accessToken: null, isValid: false };
}

export async function logout() {
  console.log("Log out");
  (await cookies()).delete("jwt");
}
