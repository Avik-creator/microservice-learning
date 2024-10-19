import express, { type Router } from "express";
import {
  ProfileController,
  getMyProfileController,
  getUserByIdController,
  getAllUsersController,
  updateProfileController,
} from "../controllers/Profile.controller";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

const router: Router = express.Router();

router.post("/profile", AuthMiddleware, ProfileController);
router.get("/get-profile", AuthMiddleware, getMyProfileController);
router.post("/update-profile", AuthMiddleware, updateProfileController);
router.get("/all-users", getAllUsersController);
router.get("/get-profile/:userId", getUserByIdController);
export default router;
