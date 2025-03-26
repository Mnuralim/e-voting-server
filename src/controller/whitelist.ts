import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../lib/utils";
import * as service from "../service/whitelist";

export const bulkAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await service.bulkAccessToken();
    res.status(200).json({
      message: "Generated bulk access token successfully",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};

export const generateAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    await service.createAccessToken(id);
    res.status(200).json({
      message: "Generated access token successfully",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};

export const whitelistAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, token, userAddress } = req.body;
  try {
    await service.whitelistAddress(email, token, userAddress);

    res.status(200).json({
      message: "Whitelisted address successfully",
    });
  } catch (error) {
    console.log(error);
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};
