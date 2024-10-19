import express, { type Router } from "express";
import { createOrderController, getOrderController } from "../controller/Order.controller";

const router: Router = express.Router();

router.post("/create-order", createOrderController);
router.get("/get-order/:id", getOrderController);

export default router;
