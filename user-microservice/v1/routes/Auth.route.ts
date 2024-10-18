import express, { type Router } from "express";
import { loginController, refreshTokenController } from "../controllers/Login.controller";
import { registerController } from "../controllers/Register.controller";

const AuthRouter: Router = express.Router();

AuthRouter.post("/login", loginController);
AuthRouter.post("/refresh-token", refreshTokenController);
AuthRouter.post("/register", registerController);

export default AuthRouter;
