import type { NextFunction, Request, Response } from "express";
import { ApiError, thirdwebAuth } from "../lib/utils";

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
      throw new ApiError("Unauthorized", 401);
    }
    const authResult = await thirdwebAuth.verifyJWT({ jwt });
    if (!authResult.valid) {
      throw new ApiError("Unauthorized", 401);
    }

    //@ts-ignore
    req.user = {
      address: authResult.parsedJWT.sub,
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
