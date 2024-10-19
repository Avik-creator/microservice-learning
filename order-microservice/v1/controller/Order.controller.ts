import { PrismaClient } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { customResponse } from "../../util/CustomResponse.util";
import { publishOrderEvent } from "../producers/producer";

const prisma = new PrismaClient();
export const createOrderController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.body, "Req Body <-");
    const { userId, items } = req.body;
    let total = 0;

    const userData = await fetch(`http://localhost:3000/api/v1/user/get-profile/${userId}`);
    //  res.status(200).json(ResponseMessage(200, profile));
    const userDataJSON = await userData.json();
    const user = userDataJSON.message;

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
        shippingAddress: user.shippingAddress,
        city: user.city,

        country: user.country,
        pincode: user.pincode,
        phoneNumber: user.phoneNumber,
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

    const orderMessage = {
      orderId: order.id,
      items: order.items,
      status: order.status,
      totalPrice: order.total,
    };

    await publishOrderEvent(orderMessage, "ORDER_PLACED");

    res.json(customResponse(order, "Order created successfully", 200));
  } catch (error) {
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

export const updateOrderController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await prisma.order.update({
      where: {
        id: id,
      },
      data: {
        status,
      },
      include: {
        items: true,
      },
    });

    const orderMessage = {
      orderId: order.id,
      items: order.items,
      status: order.status,
      totalPrice: order.total,
    };

    await publishOrderEvent(orderMessage, `ORDER_${status.toUpperCase()}`);

    res.json(customResponse(order, "Order updated successfully", 200));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update order" });
  }
};
