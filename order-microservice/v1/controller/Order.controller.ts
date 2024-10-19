import { PrismaClient } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { customResponse } from "../../util/CustomResponse.util";

const prisma = new PrismaClient();
export const createOrderController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, items } = req.body;
    let total = 0;

    const productData = await Promise.all(
      items.map(async (item: { productId: string; quantity: number }) => {
        const productResponse = await fetch(`http://localhost:6000/v1/product/get-product/${item.productId}`);

        const productData = await productResponse.json();
        const products = productData.data;
        const itemTotalPrice = products.price * item.quantity;
        total += itemTotalPrice;

        return {
          ...item,
          price: products.price,
        };
      })
    );

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: "PENDING",
        items: {
          create: productData.map(item => ({
            quantity: item.quantity,
            price: item.price,
            productId: item.productId,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    res.json(customResponse(order, "Order created successfully", 200));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

export const getOrderController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: {
        id: id,
      },
      include: {
        items: true,
      },
    });

    res.json(customResponse(order, "Order retrieved successfully", 200));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve order" });
  }
};
