import type { NextFunction, Request, Response } from "express";
import {
  ApiError,
  getContractData,
  getRoleName,
  thirdwebAuth,
} from "../lib/utils";

export const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let jwt = req.cookies?.jwt;

    if (!jwt) {
      const authHeader = req.headers["authorization"];
      jwt = authHeader && authHeader.split(" ")[1];
    }

    if (!jwt) {
      throw new ApiError("Akses tidak diizinkan", 401);
    }
    const authResult = await thirdwebAuth.verifyJWT({ jwt });
    if (!authResult.valid) {
      throw new ApiError("Akses tidak diizinkan", 401);
    }

    const role = await getRoleName(authResult.parsedJWT.sub);

    req.user = {
      address: authResult.parsedJWT.sub,
      role,
    };
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};
