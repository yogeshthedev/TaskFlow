import asyncHandler from "../../utils/asyncHandler.js";
import {
  changeTaskStatus,
  createTask,
  deleteTaskAttachment,
  getSingleTask,
  getTasks,
  updateTask,
  uploadTaskAttachment,
} from "./task.service.js";
import ApiResponse from "../../utils/apiResponse.js";

export const createTaskController = asyncHandler(async (req, res) => {
  const { title, description, status, assignedTo, attachments } = req.body;

  const task = await createTask({
    title,
    description,
    status,
    assignedTo,
    attachments,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully"));
});

export const getTasksController = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const role = req.user.role;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const status = req.query.status;
  const search = req.query.search;

  const data = await getTasks({
    userId,
    role,
    page,
    limit,
    status,
    search,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Tasks fetched successfully"));
});

export const getSingleTaskController = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await getSingleTask({
    taskId,
    userId: req.user._id,
    role: req.user.role,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task fetched successfully"));
});

export const updateTaskStatusController = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const role = req.user.role;
  const { taskId } = req.params;

  const { status } = req.body;

  const task = await changeTaskStatus({ taskId, userId, role, status });

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task status changed successfully"));
});





export const deleteTaskController = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const deleteTask = await deleteTask({ taskId });

  return res
    .status(200)
    .json(new ApiResponse(200, deleteTask, "Task deleted successfully"));
});

export const updateTaskController = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const updates = req.body;

  const updateTask = updateTask({ taskId, updates });

  return res
    .status(200)
    .json(new ApiResponse(200, updateTask, "Task updated successfully"));
});

export const uploadTaskAttachmentController = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const userId = req.user._id;
  const role = req.user.role;

  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "At least one file is required");
  }

  const updatedTask = await uploadTaskAttachment({
    taskId,
    userId,
    role,
    files: req.files, // 🔥 send array
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedTask, "Attachments uploaded successfully"),
    );
});

export const deleteTaskAttachmentController = asyncHandler(async (req, res) => {
  const { taskId, attachmentId } = req.params;

  const userId = req.user._id;
  const role = req.user.role;

  const task = await deleteTaskAttachment({
    taskId,
    attachmentId,
    userId,
    role,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Attachment deleted successfully"));
});
