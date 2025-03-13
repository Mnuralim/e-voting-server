import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../lib/utils";
import * as service from "../service/auth";
import type { VerifyLoginPayloadParams } from "thirdweb/auth";

export const getLoginPayload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { address, chainId } = req.query as {
    address: string;
    chainId: string;
  };
  try {
    const payload = await service.getLoginPayload(address, chainId);
    res.status(200).json({
      payload,
      message: "Login payload generated successfully",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const payload: VerifyLoginPayloadParams = req.body;
  try {
    const token = await service.login(payload);

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: Bun.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      domain: Bun.env.DOMAIN,
    });
    res.status(200).json({
      token,
      message: "login successful",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({
      message: "logout successful",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};

export const isLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const jwt = req.cookies?.jwt;
    const authResult = await service.isLoggedIn(jwt);
    res.status(200).json({
      isLoggedIn: authResult,
      message: authResult ? "User is logged in" : "User is not logged in",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};
