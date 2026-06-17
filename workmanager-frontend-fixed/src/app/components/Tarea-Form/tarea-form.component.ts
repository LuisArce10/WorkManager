import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TareaService } from '../../services/tarea.service';
import { TrabajadorService } from '../../services/trabajador.service';

@Component({
  selector: 'app-tarea-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tarea-form.component.html',
  styleUrls: ['./tarea-form.component.css']
})
export class TareaFormComponent implements OnInit {
  id: number | null = null;
  titulo = '';
  descripcion = '';
  fechaVencimiento = '';
  estado = 'PENDING';
  trabajadorId: number | null = null;

  trabajadores: any[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private tareaService: TareaService, private trabajadorService: TrabajadorService) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam ? Number(idParam) : null;
    this.loadTrabajadores();
    if (this.id) this.loadTarea(this.id);
  }

  loadTrabajadores(): void {
    this.trabajadorService.listarTrabajadores(0, 100).subscribe({ next: (d) => this.trabajadores = d.trabajadores || [], error: () => this.trabajadores = [] });
  }

  loadTarea(id: number): void {
    this.tareaService.obtenerTarea(id).subscribe({ next: (t) => {
        this.titulo = t.titulo || '';
        this.descripcion = t.descripcion || '';
        this.fechaVencimiento = t.fechaVencimiento ?? '';
        this.estado = t.estado ?? 'PENDING';
        this.trabajadorId = t.trabajador?.id ?? null;
      }, error: () => alert('No se pudo cargar la tarea') });
  }

  guardar(): void {
    const payload: any = {
      titulo: this.titulo,
      descripcion: this.descripcion,
      fechaVencimiento: this.fechaVencimiento || null,
      estado: this.estado,
      trabajador: this.trabajadorId ? { id: this.trabajadorId } : null
    };

    if (this.id) {
      this.tareaService.actualizarTarea(this.id, payload).subscribe({ next: () => this.router.navigate(['/tareas']), error: () => alert('Error al actualizar') });
    } else {
      this.tareaService.crearTarea(payload).subscribe({ next: () => this.router.navigate(['/tareas']), error: () => alert('Error al crear') });
    }
  }

  cancel(): void {
    this.router.navigate(['/tareas']);
  }
}
