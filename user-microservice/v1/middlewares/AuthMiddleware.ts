import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";

// Extend the Request interface to include the user property
declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}

import { ResponseMessage } from "../util/Response";
import Service from "../service/service.ts";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(ResponseMessage(401, "Unauthorized"));
  }
  const token = authHeader.split(" ")[1];

  try {
    const user = Service.decode(token) as JwtPayload;

    const userId = user.userId;
    const userExists = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

    Service.verify(token, userExists.id);
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return next(ResponseMessage(401, "Unauthorized"));
  }
};
