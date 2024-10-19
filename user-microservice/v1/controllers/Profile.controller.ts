import { PrismaClient } from "@prisma/client";
import { type NextFunction, type Request, type Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import { ResponseMessage } from "../util/Response";
import { ZodError } from "zod";
import { publishUserEvent } from "../publisher/publisher";

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}

const prisma = new PrismaClient();

export const ProfileController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req?.user?.userId as string;
    const { bio, shippingAddress, phoneNumber, pincode, city, country } = req.body;
    const profile = await prisma.profile.create({
      data: {
        userId: userId,
        bio: bio,
        shippingAddress: shippingAddress,
        phoneNumber: phoneNumber,
        pincode: pincode,
        city: city,
        country: country,
      },
    });
    res.status(201).json(ResponseMessage(201, profile));
  } catch (error) {
    if (error instanceof ZodError) {
      return next(ResponseMessage(400, error.errors));
    }
    return next(ResponseMessage(500, "Internal server error"));
  }
};

export const updateProfileController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req?.user?.userId;
    const { bio, shippingAddress, phoneNumber, pincode, city, country, name } = req.body;
    const profile = await prisma.profile.update({
      where: { userId },
      data: {
        bio,
        shippingAddress,
        phoneNumber,
        pincode,
        city,
        country,
      },
      select: {
        user: true,
        phoneNumber: true,
        pincode: true,
        shippingAddress: true,
        city: true,
        country: true,
      },
    });

    const message = {
      name: profile.user.name,
      userId: profile.user.id,
      email: profile.user.email,
      phoneNumber: profile.phoneNumber,
      city: profile.city,
      shippingAddress: profile.shippingAddress,
      country: profile.country,
    };

    await publishUserEvent(message, "USER_PROFILE_UPDATED");
    res.status(200).json(ResponseMessage(200, profile));
  } catch (error) {
    console.log(error);
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

export const getUserByIdController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log("Get user by id controller called");
  try {
    const userId = req.params.userId;
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

export const getAllUsersController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await prisma.profile.findMany();
    if (users) {
      res.status(200).json(ResponseMessage(200, users));
    } else {
      res.status(400).json(ResponseMessage(400, "Couldnt find the Response"));
    }
  } catch (error) {
    console.log(error);
    return next(ResponseMessage(500, "Internal server error"));
  }
};
