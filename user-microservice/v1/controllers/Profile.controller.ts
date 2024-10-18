import { PrismaClient } from "@prisma/client";
import { type NextFunction, type Request, type Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import { ResponseMessage } from "../util/Response";
import { ZodError } from "zod";

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}

const prisma = new PrismaClient();

export const ProfileController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req?.user?.userId as string;
    const name = req?.user?.name as string;
    const bio = req.body.bio;

    const profile = await prisma.profile.findUnique({ where: { userId } });

    if (profile) {
      const updatation = await prisma.profile.update({
        where: { userId },
        data: { bio: bio },
      });

      if (updatation) {
        res.status(200).json(ResponseMessage(200, updatation));
      }
    } else {
      await prisma.profile.create({
        data: {
          id: userId,
          name: name,
          bio: bio,
          user: {
            connect: { id: userId },
          },
        },
      });
      res.status(201).json(ResponseMessage(201, "Created Successfully"));
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return next(ResponseMessage(400, error.errors));
    }
    return next(ResponseMessage(500, "Internal server error"));
  }
};

export const getMyProfileController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req?.user?.userId;
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (profile) {
      res.status(200).json(ResponseMessage(200, profile));
    } else {
      res.status(400).json(ResponseMessage(400, "Couldnt find the Response"));
    }
  } catch (error) {
    console.log(error);
    return next(ResponseMessage(500, "Internal server error"));
  }
};
