import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { roleMiddleware } from "../../middlewares/role.middleware.js";
import {
  adminDashboardController,
  recentTasksController,
  tasksByStatusController,
  tasksPerUserController,
} from "./admin.controller.js";

const router = Router();

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("admin"),
  adminDashboardController,
);

router.get(
  "/tasks/status",
  authMiddleware,
  roleMiddleware("admin"),
  tasksByStatusController,
);

router.get(
  "/tasks/users",
  authMiddleware,
  roleMiddleware("admin"),
  tasksPerUserController,
);

router.get(
  "/tasks/recent",
  authMiddleware,
  roleMiddleware("admin"),
  recentTasksController,
);
