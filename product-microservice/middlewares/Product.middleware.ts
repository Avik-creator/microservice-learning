import { type NextFunction, type Request, type Response } from "express";
import { customMessage } from "../util/util";

export const ProductMiddleware = async (_req: Request, _res: Response, next: NextFunction) => {
  try {
    next();
  } catch (error) {
    next(customMessage("An error occurred", error));
  }
};
