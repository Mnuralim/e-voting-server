import type { LoginPayload, VerifyLoginPayloadParams } from "thirdweb/auth";
import { ApiError, getContractData, thirdwebAuth } from "../lib/utils";
import { readContract } from "thirdweb";

export const getLoginPayload = async (
  address: string,
  chainId: string
): Promise<LoginPayload> => {
  if (!address) {
    throw new ApiError("Alamat wallet wajib diisi", 400);
  }

  const payload = await thirdwebAuth.generatePayload({
    address,
    chainId: chainId ? parseInt(chainId) : undefined,
  });

  return payload;
};

export const login = async (
  payload: VerifyLoginPayloadParams
): Promise<string> => {
  const verifiedPayload = await thirdwebAuth.verifyPayload(payload);
  if (verifiedPayload.valid) {
    const owner = await readContract({
      contract: getContractData("VOTE"),
      method: "admin",
    });

    const jwt = await thirdwebAuth.generateJWT({
      payload: verifiedPayload.payload,
      context: {
        role:
          owner.toLowerCase() === verifiedPayload.payload.address.toLowerCase()
            ? "admin"
            : "user",
      },
    });
    return jwt;
  }

  throw new ApiError("Gagal melakukan login", 400);
};

export const isLoggedIn = async (jwt: string): Promise<boolean> => {
  if (!jwt) {
    return false;
  }

  const authResult = await thirdwebAuth.verifyJWT({ jwt });
  if (!authResult.valid) {
    return false;
  }

  return authResult.valid;
};
