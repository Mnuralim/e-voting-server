import type { NextFunction, Request, Response } from "express";
import { ApiError, getContractData } from "../lib/utils";
import { readContract } from "thirdweb";

export const disableVoting = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const isVotingStarted = await readContract({
      contract: getContractData("VOTE"),
      method: "globalVotingPeriod",
    });

    if (isVotingStarted[0]) {
      throw new ApiError("Voting sudah berlangsung", 400);
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
