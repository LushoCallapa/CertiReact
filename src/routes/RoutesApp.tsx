import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../layout/Layout";
import Subasta from "../Pages/user/Subasta";
import Historial from "../Pages/user/Historial";
import Resultados from "../Pages/user/Resultados";
import GestionProductos from "../Pages/pages/GestionProductos";
import GestionUsuarios from "../Pages/pages/GestionUsuarios";
import LoginPage from "../Pages/LoginPage";
import RegisterPage from "../Pages/RegisterPage";
import { useUser } from "../context/UserContext";
import PujasPage from "../Pages/user/PujasPage";

const RoutesApp = () => {
  const { user } = useUser();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {user && (
          <Route path="/" element={<Layout />}>
            {user.rol === "usuario" && (
              <>
                <Route path="user/subasta" element={<Subasta />} />
                <Route path="user/pujas/:idProducto" element={<PujasPage />} />
                <Route path="user/historial" element={<Historial />} />
                <Route path="user/resultados" element={<Resultados />} />
              </>
            )}

            {user.rol === "admin" && (
              <>
                <Route path="admin/productos" element={<GestionProductos />} />
                <Route path="admin/usuarios" element={<GestionUsuarios />} />
              </>
            )}
          </Route>
        )}

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesApp;
