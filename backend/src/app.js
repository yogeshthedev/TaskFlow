import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser())


import authRoutes from './modules/auth/auth.routes.js';
import taskRoutes from './modules/task/task.routes.js';

app.use("/api/v1/users",authRoutes)
app.use("/api/v1/tasks",taskRoutes)

export default app;