export interface User {
  id: string;
  nombre: string;
  password: string;
  rol: 'usuario' | 'admin';
}