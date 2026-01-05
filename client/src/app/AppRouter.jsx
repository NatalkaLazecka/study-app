import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '@/pages/landing/LandingPage';
import HomePage from '@/pages/home/HomePage';
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';
import ResetPasswordPage from '@/features/auth/pages/ResetPasswordPage';
import TodoListPage from '@/features/todo/pages/TodoListPage';
import TodoDetailsPage from '@/features/todo/pages/TodoDetailsPage';
import CalendarPage from "../features/calendar/pages/CalendarPage";
import CalendarEventPage from "../features/calendar/pages/CalendarEventPage";
import GroupListPage from '@/features/group/pages/GroupListPage';
import GroupCreatePage from '@/features/group/pages/GroupCreatePage';
import GroupDetailsPage from '@/features/group/pages/GroupDetailsPage';
import ScheduleEditPage from "../features/schedule/pages/ScheduleEditPage";
import SchedulePage from "../features/schedule/pages/SchedulePage";
import {ErrorBoundary} from "@/components/ErrorBoundary.jsx";
import { ProtectedRoute } from "@/components/ProtectedRoute";




export default function AppRouter() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protected */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/todo"
          element={
            <ProtectedRoute>
              <TodoListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/todo/edit/:id"
          element={
            <ProtectedRoute>
              <TodoDetailsPage mode="edit" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/todo/new"
          element={
            <ProtectedRoute>
              <TodoDetailsPage mode="new" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/calendar/event"
          element={
            <ProtectedRoute>
              <CalendarEventPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <SchedulePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/schedule/edit"
          element={
            <ProtectedRoute>
              <ScheduleEditPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/groups"
          element={
            <ProtectedRoute>
              <GroupListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/groups/new"
          element={
            <ProtectedRoute>
              <GroupCreatePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/groups/:id"
          element={
            <ProtectedRoute>
              <GroupDetailsPage />
            </ProtectedRoute>
          }
        />



        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

