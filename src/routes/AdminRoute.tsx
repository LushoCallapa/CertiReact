import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import type { ReactNode } from "react";

const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.rol !== "admin") {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default AdminRoute;
