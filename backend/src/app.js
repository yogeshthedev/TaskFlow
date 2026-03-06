import express from "express";
import cookieParser from "cookie-parser";
import { apiLimiter } from "./middlewares/rateLimit.middleware.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

// request logging
app.use(morgan("dev"));
app.use("/api", apiLimiter);

import authRoutes from "./modules/auth/auth.routes.js";
import taskRoutes from "./modules/task/task.routes.js";
import { apiLimiter } from "./middlewares/rateLimit.middleware.js";

app.use("/api/v1/users", authRoutes);
app.use("/api/v1/tasks", taskRoutes);

export default app;
