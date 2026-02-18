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
