// pages/GestionUsuarios.tsx
import { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import {
  getUsuarios,
  register,
  updateUsuario,
  deleteUsuario,
} from "../../services/authService";
import type { User } from "../../interfaces/User";
import TablaUsuarios from "../../component/TablaUsuarios";
import DialogUsuario from "../../component/DialogUsuario";

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState<User>({
    id: "",
    nombre: "",
    password: "",
    rol: "usuario",
  });

  const cargarUsuarios = async () => {
    const data = await getUsuarios();
    setUsuarios(data);
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleOpenCrear = () => {
    (document.activeElement as HTMLElement)?.blur();
    setEditando(false);
    setUsuarioActual({ id: "", nombre: "", password: "", rol: "usuario" });
    setOpen(true);
  };

  const handleOpenEditar = (usuario: User) => {
    (document.activeElement as HTMLElement)?.blur();
    setEditando(true);
    setUsuarioActual(usuario);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleGuardar = async () => {
    if (editando) {
      await updateUsuario(usuarioActual);
    } else {
      await register(usuarioActual.nombre, usuarioActual.password, usuarioActual.rol);
    }
    await cargarUsuarios();
    handleClose();
  };

  const handleEliminar = async (id: string) => {
    await deleteUsuario(id);
    await cargarUsuarios();
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Usuarios
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpenCrear}>
        Crear Usuario
      </Button>

      <TablaUsuarios
        usuarios={usuarios}
        onEditar={handleOpenEditar}
        onEliminar={handleEliminar}
      />

      <DialogUsuario
        open={open}
        usuario={usuarioActual}
        editando={editando}
        onChange={setUsuarioActual}
        onClose={handleClose}
        onSave={handleGuardar}
      />
    </div>
  );
};

export default GestionUsuarios;
