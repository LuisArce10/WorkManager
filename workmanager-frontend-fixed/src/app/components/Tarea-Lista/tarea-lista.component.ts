import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TareaService } from '../../services/tarea.service';
import { AuthService } from '../../services/auth.service';
import { Tarea } from '../../models/tarea.model';

@Component({
  selector: 'app-tarea-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tarea-lista.component.html',
  styleUrls: ['./tarea-lista.component.css']
})
export class TareaListaComponent implements OnInit {
  tareas = signal<Tarea[]>([]);
  currentPage = signal<number>(0);
  totalPages = signal<number>(0);
  totalItems = signal<number>(0);
  pageSize = 10;
  searchTerm = signal<string>('');

  isAdmin = false;

  constructor(private tareaService: TareaService, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isAdmin = this.auth.isAdmin();
    this.cargar();
  }

  cargar(): void {
    this.tareaService.listarTareas(this.currentPage(), this.pageSize, this.searchTerm()).subscribe({
      next: (data) => {
        this.tareas.set(data.tareas);
        this.currentPage.set(data.currentPage);
        this.totalPages.set(data.totalPages);
        this.totalItems.set(data.totalItems);
      },
      error: (err) => { console.error(err); alert('Error cargando tareas'); }
    });
  }

  buscar(): void { this.currentPage.set(0); this.cargar(); }

  limpiar(): void { this.searchTerm.set(''); this.currentPage.set(0); this.cargar(); }

  nuevo(): void { if (!this.isAdmin) { alert('Sólo admin'); return; } this.router.navigate(['/tareas/nuevo']); }

  editar(id: number): void { if (!this.isAdmin) { alert('Sólo admin'); return; } this.router.navigate(['/tareas/editar', id]); }

  eliminar(id: number): void {
    if (!this.isAdmin) { alert('Sólo admin'); return; }
    if (!confirm('Eliminar tarea?')) return;
    this.tareaService.eliminarTarea(id).subscribe({ next: () => this.cargar(), error: (e) => { console.error(e); alert('Error al eliminar'); } });
  }

}
