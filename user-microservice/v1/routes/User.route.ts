import express, { type Router } from "express";
import { ProfileController, getMyProfileController } from "../controllers/Profile.controller";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

const router: Router = express.Router();

router.post("/profile", AuthMiddleware, ProfileController);
router.get("/get-profile", AuthMiddleware, getMyProfileController);
export default router;
