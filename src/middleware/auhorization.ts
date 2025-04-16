import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../lib/utils";

export const authorization = (role: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user?.role !== "admin" && req.user?.role !== role) {
        return next(new ApiError("Akses tidak diizinkan", 401));
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
};
