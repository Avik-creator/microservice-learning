import { PrismaClient } from "@prisma/client";
import type { NextFunction, Response, Request } from "express";
import { customResponse } from "../util/util";
import { z } from "zod";

const ProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  stock: z.number(),
});

const prisma = new PrismaClient();
export const createProductController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, price, stock } = await ProductSchema.parseAsync(req.body);
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
      },
    });
    res.json(customResponse(200, "Product created successfully", product));
  } catch {
    next(customResponse(400, "Product Creation Error", null));
  }
};

export const UpdateProductController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock } = await ProductSchema.parseAsync(req.body);
    const product = await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        name,
        description,
        price,
        stock,
      },
    });
    res.json(customResponse(200, "Product updated successfully", product));
  } catch {
    next(customResponse(400, "Product Update Error", null));
  }
};

export const getProductController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await prisma.product.findMany();
    res.json(customResponse(200, "Products fetched successfully", products));
  } catch {
    next(customResponse(400, "Product Fetch Error", null));
  }
};

export const getProdctDetailsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });
    res.json(customResponse(200, "Product fetched successfully", product));
  } catch {
    next(customResponse(400, "Product Fetch Error", null));
  }
};

export const deleteProductController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: {
        id: id,
      },
    });
    res.json(customResponse(200, "Product deleted successfully", id));
  } catch {
    next(customResponse(400, "Product Delete Error", null));
  }
};
