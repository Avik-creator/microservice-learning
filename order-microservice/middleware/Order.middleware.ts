import { type NextFunction, type Request, type Response } from "express";
import { customResponse } from "../util/CustomResponse.util";

export const orderMiddleware = async (_req: Request, _res: Response, next: NextFunction) => {
  try {
    next();
  } catch (error) {
    if (error instanceof Error) {
      next(customResponse("An error occurred", error.message, 500));
    } else {
      next(customResponse("An error occurred", "Unknown error", 500));
    }
  }
};
