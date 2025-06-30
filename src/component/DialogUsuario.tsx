import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import type { User } from "../interfaces/User";

interface Props {
  open: boolean;
  usuario: User;
  editando: boolean;
  onChange: (usuario: User) => void;
  onClose: () => void;
  onSave: () => void;
}

const roles = ["usuario", "admin"];

const DialogUsuario = ({ open, usuario, editando, onChange, onClose, onSave }: Props) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editando ? "Editar Usuario" : "Crear Usuario"}</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField
          label="Nombre"
          value={usuario.nombre}
          onChange={(e) => onChange({ ...usuario, nombre: e.target.value })}
        />
        <TextField
          label="Contraseña"
          type="password"
          value={usuario.password}
          onChange={(e) => onChange({ ...usuario, password: e.target.value })}
        />
        <TextField
          select
          label="Rol"
          value={usuario.rol}
          onChange={(e) =>
            onChange({ ...usuario, rol: e.target.value as "usuario" | "admin" })
          }
        >
          {roles.map((r) => (
            <MenuItem key={r} value={r}>
              {r}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onSave} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogUsuario;
