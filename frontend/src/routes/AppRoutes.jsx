import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage.jsx";
import TasksPage from "../features/tasks/TasksPage.jsx";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<TasksPage />} />
      </Routes>
    </BrowserRouter>
  );
}