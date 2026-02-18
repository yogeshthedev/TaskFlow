import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { roleMiddleware } from "../../middlewares/role.middleware.js";

import {
  createTaskController,
  deleteTaskAttachmentController,
  deleteTaskController,
  getSingleTaskController,
  getTasksController,
  updateTaskController,
  updateTaskStatusController,
  uploadTaskAttachmentController,
} from "./task.controller.js";
import validate from "../../middlewares/validate.middleware.js";
import { createTaskValidation } from "./task.validation.js";
import { upload } from './../../middlewares/upload.middleware.js';

const router = Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createTaskValidation,
  validate,
  createTaskController,
);

router.get("/", authMiddleware, getTasksController);

router.get("/:taskId", authMiddleware, getSingleTaskController);

router.patch(
  "/:taskId",
  authMiddleware,
  roleMiddleware("admin"),
  updateTaskController,
);

router.patch("/:taskId/status", authMiddleware, updateTaskStatusController);

router.delete(
  "/:taskId",
  authMiddleware,
  roleMiddleware("admin"),
  deleteTaskController,
);

router.post(
  "/:taskId/attachments",
  authMiddleware,
  upload.array("files", 5),
  uploadTaskAttachmentController,
);

router.delete(
  "/:taskId/attachments/:attachmentId",
  authMiddleware,
  deleteTaskAttachmentController
);




export default router;
