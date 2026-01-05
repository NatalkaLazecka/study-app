import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "@/pages/landing/LandingPage";
import HomePage from "@/pages/home/HomePage";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";
import TodoListPage from "@/features/todo/pages/TodoListPage";
import TodoDetailsPage from "@/features/todo/pages/TodoDetailsPage";
import CalendarPage from "@/features/calendar/pages/CalendarPage";
import CalendarEventPage from "@/features/calendar/pages/CalendarEventPage";
import GroupListPage from "@/features/group/pages/GroupListPage";
import GroupCreatePage from "@/features/group/pages/GroupCreatePage";
import GroupDetailsPage from "@/features/group/pages/GroupDetailsPage";
import SchedulePage from "@/features/schedule/pages/SchedulePage";
import ScheduleEditPage from "@/features/schedule/pages/ScheduleEditPage";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AppLayout from "@/layouts/AppLayout";

export default function AppRouter() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* PROTECTED */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/todo" element={<TodoListPage />} />
            <Route path="/todo/new" element={<TodoDetailsPage mode="new" />} />
            <Route path="/todo/edit/:id" element={<TodoDetailsPage mode="edit" />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/calendar/event" element={<CalendarEventPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/schedule/edit" element={<ScheduleEditPage />} />
            <Route path="/groups" element={<GroupListPage />} />
            <Route path="/groups/new" element={<GroupCreatePage />} />
            <Route path="/groups/:id" element={<GroupDetailsPage />} />
          </Route>
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}
