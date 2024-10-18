import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters long")
  .max(100, "Password must be at most 100 characters long")
  .trim();

export const emailSchema = z
  .string()
  .min(5, "Email must be at least 5 characters long")
  .max(100, "Email must be at most 100 characters long")
  .email("Invalid email")
  .trim()
  .refine(async email => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      return "Email is already taken";
    } else {
      return true;
    }
  });

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(100, "Name must be at most 100 characters long")
    .trim(),
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type loginSchemaType = z.infer<typeof loginSchema>;
