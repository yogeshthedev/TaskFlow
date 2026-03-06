import { Task } from "../task/task.model.js";

export const getAdminDashboardStats = async () => {
  const stats = await Task.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

 
  const dashboard = {
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
  };

  for (const item of stats) {
    dashboard.totalTasks += item.count;

    if (item._id === "pending") {
      dashboard.pendingTasks = item.count;
    }

    if (item._id === "in_progress") {
      dashboard.inProgressTasks = item.count;
    }

    if (item._id === "completed") {
      dashboard.completedTasks = item.count;
    }
  }

  return dashboard;
};


export const getTasksByStatus = async () => {
  const stats = await Task.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  return stats;
};

export const getTasksPerUser = async () => {
  const stats = await Task.aggregate([
    {
      $group: { // Group by assignedTo user
        _id: "$assignedTo",
        taskCount: { $sum: 1 },
      },
    },
    {
      $lookup: { // Join with users collection to get user details
        from: "users",           // users collection
        localField: "_id",       // assignedTo id
        foreignField: "_id",     // user _id
        as: "user",
      },
    },
    {
      $unwind: "$user", // Unwind the user array to get individual user details
    },
    {
      $project: { // Project the desired fields
        _id: 0,
        userId: "$user._id",
        name: "$user.name",
        email: "$user.email",
        taskCount: 1,
      },
    },
  ]);

  return stats;
};