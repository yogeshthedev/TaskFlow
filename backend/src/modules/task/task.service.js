import { deleteFile, uploadFile } from "../../config/imagekit.js";
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

export const getTasks = async ({ userId, role, page, limit, status, search }) => {
  const query = {};

  // role based filter
  if (role === "user") {
    query.assignedTo = userId;
  }

  // status filter
  if (status) {
    query.status = status;
  }

  // search filter
  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  const skip = (page - 1) * limit;

  const tasks = await Task.find(query)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalTasks = await Task.countDocuments(query);

  return {
    tasks,
    pagination: {
      totalTasks,
      currentPage: page,
      limit,
      totalPages: Math.ceil(totalTasks / limit),
    },
  };
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

export const updateTask = async ({ taskId, updates }) => {
  const allowedFields = ["title", "description", "assignedTo"];

  const updateData = {};

  for (let key in updates) {
    if (allowedFields.includes(key)) {
      updateData[key] = updates[key];
    }
  }

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "No valid fields provided for update");
  }

  const task = await Task.findByIdAndUpdate(taskId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return task;
};

export const uploadTaskAttachment = async ({ taskId, userId, role, files }) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (role === "user") {
    if (task.assignedTo.toString() !== userId.toString()) {
      throw new ApiError(403, "Forbidden: You cannot upload to this task");
    }
  }

  for (const file of files) {
    const uploaded = await uploadFile(file.buffer, file.originalname);

    task.attachments.push({
      filename: file.originalname,
      url: uploaded.url,
      fileId: uploaded.fileId,
      createdBy: userId,
    });
  }

  await task.save();
  return task;
};

export const deleteTaskAttachment = async ({
  taskId,
  attachmentId,
  userId,
  role,
}) => {
  // 1️⃣ Find task
  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // 2️⃣ Find attachment
  const attachment = task.attachments.id(attachmentId);

  if (!attachment) {
    throw new ApiError(404, "Attachment not found");
  }

  // 3️⃣ Permission check
  if (role === "user") {
    if (attachment.createdBy.toString() !== userId.toString()) {
      throw new ApiError(403, "Forbidden: You cannot delete this attachment");
    }
  }

  // 4️⃣ Delete from ImageKit (CRITICAL)
  if (attachment.fileId) {
    await deleteFile(attachment.fileId);
  } else {
    // Safety guard for old data
    console.warn("Missing fileId for attachment:", attachment._id);
  }

  // 5️⃣ Remove from MongoDB
  attachment.deleteOne();
  await task.save();

  return task;
};
