import asyncHandler from "../../utils/asyncHandler.js";
import {
  changeTaskStatus,
  createTask,
  getSingleTask,
  getTasks,
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

  // Filters from query params
  const filters = {
    status: req.query.status,
    search: req.query.search,
  };

  const tasks = await getTasks({ userId, role, filters });

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
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
