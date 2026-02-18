import asyncHandler from "../../utils/asyncHandler";
import { getAdminDashboardStats } from "./admin.service.js";

export const adminDashboardController = asyncHandler(async (req, res) => {
  const dashboardData = await getAdminDashboardStats();

  return res
    .status(200)
    .json(new ApiResponse(200, dashboardData, "Admin dashboard data fetched"));
});
export const tasksByStatusController = asyncHandler(async (req, res) => {});
export const tasksPerUserController = asyncHandler(async (req, res) => {});
export const recentTasksController = asyncHandler(async (req, res) => {});
