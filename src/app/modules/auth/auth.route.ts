import { Router } from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { registerValidation, loginValidation } from "../user/user.validation";

const router = Router();

router.post(
    "/register",
    validateRequest(registerValidation),
    AuthController.register
);

router.post(
    "/login",
    validateRequest(loginValidation),
    AuthController.login
);

export const AuthRoutes = router;
