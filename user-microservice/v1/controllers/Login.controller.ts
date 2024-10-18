import { PrismaClient } from "@prisma/client";
import { type NextFunction, type Request, type Response } from "express";

import { type loginSchemaType, loginSchema } from "../../schemas/index.ts";
import bcrypt from "bcrypt";
import Service from "../service/service.ts";
import { ResponseMessage } from "../util/Response";
import { z, ZodError } from "zod";

const refreshTokenSchema = z.string().min(1, "Refresh token is required");

const prisma = new PrismaClient();

export const loginController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = await loginSchema.parseAsync(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return next(ResponseMessage(404, "User not found"));
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return next(ResponseMessage(400, "Invalid credentials"));
    }

    const jwtPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
    };

    const accessToken = Service.sign(jwtPayload, user.id);
    const refreshToken = Service.sign(jwtPayload, user.id, "24h");

    await prisma.refreshTokens.create({
      data: {
        token: refreshToken,
        name: user.name,
        userId: user.id,
      },
    });

    res.cookie("accessToken", accessToken, {
      maxAge: 12 * 60 * 60 * 1000, // 12 hours in milliseconds
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
      httpOnly: true,
    });

    res.json(ResponseMessage(200, { accessToken, refreshToken }));
  } catch (error) {
    console.error(error);
    if (error instanceof ZodError) {
      return next(ResponseMessage(400, error.errors));
    }

    return next(ResponseMessage(500, "Internal server error"));
  }
};

export const refreshTokenController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const RefreshTokenParsed = await refreshTokenSchema.parseAsync(refreshToken);
    const { id } = Service.decode(RefreshTokenParsed);
    Service.verify(refreshToken, id);
    const refreshTokenExists = await prisma.refreshTokens.findMany({
      where: {
        AND: [{ id }, { token: RefreshTokenParsed }],
      },
      select: {
        id: true,
        token: true,
        name: true,
        userId: true,
      },
    });

    if (refreshTokenExists.length != -1) {
      return next(ResponseMessage(404, "Refresh token not found"));
    }

    try {
      await prisma.refreshTokens.delete({
        where: {
          token: RefreshTokenParsed,
        },
      });
    } catch {
      console.error("Error deleting refresh token");
    }

    const JWTPayload = {
      id: refreshTokenExists[0].userId,
      name: refreshTokenExists[0].name,
    };
    const accessToken = Service.sign(JWTPayload, refreshTokenExists[0].userId);
    const newRefreshToken = Service.sign(JWTPayload, refreshTokenExists[0].userId, "24h");

    await prisma.refreshTokens.create({
      data: {
        token: newRefreshToken,
        userId: refreshTokenExists[0].userId,
        name: refreshTokenExists[0].name,
      },
    });

    res.cookie("accessToken", accessToken, {
      maxAge: 12 * 60 * 60 * 1000, // 12 hours in milliseconds
      httpOnly: true,
    });

    res.cookie("refreshToken", newRefreshToken, {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
      httpOnly: true,
    });

    res.json(ResponseMessage(200, { accessToken, newRefreshToken }));
  } catch (error) {
    console.error(error);
    if (error instanceof ZodError) {
      return next(ResponseMessage(400, error.errors));
    }

    return next(ResponseMessage(500, "Internal server error"));
  }
};
