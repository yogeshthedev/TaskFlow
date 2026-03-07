import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.urlencoded({ extended: true }));

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
