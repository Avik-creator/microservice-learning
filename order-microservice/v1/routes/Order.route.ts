import express, { type Router } from "express";
import { createOrderController, getOrderController, updateOrderController } from "../controller/Order.controller";

const router: Router = express.Router();

router.post("/create-order", createOrderController);
router.get("/get-order/:id", getOrderController);
router.post("/update-order-status/:id", updateOrderController);

export default router;
