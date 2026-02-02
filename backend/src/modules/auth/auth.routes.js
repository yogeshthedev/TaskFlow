import Router from "express";
import { login, register } from "./auth.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);

export default router;
