import { Router } from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { registerValidation, loginValidation } from "../user/user.validation";
import { auth } from "../../middlewares/auth";

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

router.post(
    "/change-password",
    auth,
    AuthController.changePassword
);

export const AuthRoutes = router;
