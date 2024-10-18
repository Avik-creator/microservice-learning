import express, { type Router } from "express";
import {
  createProductController,
  UpdateProductController,
  deleteProductController,
  getProdctDetailsController,
  getProductController,
} from "../controllers/Product.controller";

const router: Router = express.Router();

router.post("/create-product", createProductController);
router.patch("/update-product/:id", UpdateProductController);
router.get("/get-product/:id", getProdctDetailsController);
router.get("/get-all-products", getProductController);
router.delete("/delete-product/:id", deleteProductController);

export default router;
