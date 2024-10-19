import { Prisma, PrismaClient } from "@prisma/client";
import { type NextFunction, type Request, type Response } from "express";

import { ResponseMessage } from "../util/Response";
import { z, ZodError } from "zod";
import bcrypt from "bcrypt";
import { publishUserEvent } from "../publisher/publisher";
import { registerSchema } from "../../schemas";

const prisma = new PrismaClient();

type registerSchemaType = z.infer<typeof registerSchema>;

export const registerController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log("Register controller called");
  try {
    const { name, email, password } = await registerSchema.parseAsync(req.body);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const sentUserData = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    publishUserEvent(sentUserData, "USER_REGISTERED");

    res.json(ResponseMessage(200, sentUserData));
  } catch (error) {
    if (error instanceof ZodError) {
      return next(ResponseMessage(400, error.errors));
    }
    return next(ResponseMessage(500, "Internal server error"));
  }
};
