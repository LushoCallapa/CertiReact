import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import type { User } from "../interfaces/User";

interface Props {
  usuarios: User[];
  onEditar: (usuario: User) => void;
  onEliminar: (id: string) => void;
}

const TablaUsuarios = ({ usuarios, onEditar, onEliminar }: Props) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {usuarios.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.nombre}</TableCell>
              <TableCell>{user.rol}</TableCell>
              <TableCell>
                <IconButton onClick={() => onEditar(user)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => onEliminar(user.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TablaUsuarios;
