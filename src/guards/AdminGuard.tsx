import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

const AdminGuard = () => {
  const { user } = useUser();
  if (!user || user.rol !== "admin") {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default AdminGuard;
