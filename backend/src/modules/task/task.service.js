import { Task } from "../../models/task.model.js";
import ApiError from "../../utils/apiError.js";

export const createTask = async ({
  title,
  description,
  status,
  assignedTo,
  createdBy,
  attachments = [],
}) => {
  const task = await Task.create({
    title,
    description,
    status,
    assignedTo,
    createdBy,
    attachments,
  });

  return task;
};

export const getTasks = async ({ userId, role, filters }) => {
  let query = {};

  // ✅ User can only see their own assigned tasks
  if (role === "user") {
    query.assignedTo = userId;
  }

  // ✅ Admin can filter tasks (optional)
  if (filters?.status) {
    query.status = filters.status;
  }

  if (filters?.search) {
    query.title = { $regex: filters.search, $options: "i" };
  }

  // Fetch tasks from DB
  const tasks = await Task.find(query)
    .populate("assignedTo", "name email role")
    .populate("createdBy", "name email role")
    .sort({ createdAt: -1 });

  return tasks;
};

export const getSingleTask = async ({ taskId, userId, role }) => {
  const task = await Task.findById(taskId)
    .populate("assignedTo", "name email role")
    .populate("createdBy", "name email role");

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (role === "user") {
    if (task.assignedTo._id.toString() !== userId.toString()) {
      throw new ApiError(403, "forbidden , you cannot access this task");
    }
  }
  return task;
};

export const changeTaskStatus = async ({ taskId, userId, role, status }) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (role === "user") {
    if (task.assignedTo.toString() !== userId.toString()) {
      throw new ApiError(403, "Forbidden: You cannot update this task");
    }
  }

  const allowedStatus = ["pending", "in_progress", "completed"];

  if (!allowedStatus.includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  task.status = status;
  await task.save();

  return task;
};

export const deleteTask = async ({ taskId }) => {
  const task = await Task.findByIdAndDelete(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return task;
};
