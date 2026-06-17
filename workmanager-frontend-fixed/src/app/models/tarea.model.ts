export interface Tarea {
  id?: number;
  titulo: string;
  descripcion?: string;
  fechaVencimiento?: string; // ISO date
  estado?: string; // PENDING, IN_PROGRESS, DONE
  trabajador?: any; // trabajador object or id
}
