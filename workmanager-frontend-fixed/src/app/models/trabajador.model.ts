export interface Trabajador {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: number;
  sexo: string;
  salario: number;
  fecha: Date | string; // <--- Cambia esto
  activo?: boolean;
}