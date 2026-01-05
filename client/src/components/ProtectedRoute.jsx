import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute() {
  const isAuth = true;

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
