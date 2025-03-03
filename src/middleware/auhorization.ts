import type { NextFunction, Request, Response } from "express";
import { ApiError, getContractData } from "../lib/utils";
import { readContract } from "thirdweb";

export const authorization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const owner = await readContract({
      contract: getContractData("VOTE"),
      method: "admin",
    });

    //@ts-ignore
    if (owner.toLowerCase() !== req.user.address.toLowerCase()) {
      throw new ApiError("Unauthorized", 401);
    }

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};
