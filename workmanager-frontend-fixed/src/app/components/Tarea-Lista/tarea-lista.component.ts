import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  searchTerm: string = '';

  isAdmin: boolean = false;
  currentUser: any;

  constructor(
    private tareaService: TareaService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.checkUserRole();
    this.cargarTareas();
  }

  checkUserRole(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = this.authService.isAdmin();
  }

  cargarTareas(): void {
    // 1. Si es Administrador, visualiza todas las tareas de manera global
    if (this.isAdmin) {
      this.tareaService.listarTareas(this.currentPage(), this.pageSize, this.searchTerm)
        .subscribe({
          next: (data) => {
            this.tareas.set(data.tareas);
            this.currentPage.set(data.currentPage);
            this.totalPages.set(data.totalPages);
            this.totalItems.set(data.totalItems);
          },
          error: (error) => {
            console.error('Error al cargar la lista global de tareas:', error);
            alert('Error al obtener el listado de tareas');
          }
        });
    } else {
      // 2. Si es un empleado regular (Trabajador), se filtra estrictamente por su ID único
      const trabajadorId = this.currentUser?.id;
      
      if (trabajadorId) {
        this.tareaService.listarTareasPorTrabajador(trabajadorId, this.currentPage(), this.pageSize, this.searchTerm)
          .subscribe({
            next: (data) => {
              this.tareas.set(data.tareas);
              this.currentPage.set(data.currentPage);
              this.totalPages.set(data.totalPages);
              this.totalItems.set(data.totalItems);
            },
            error: (error) => {
              console.error('Error al cargar las tareas asignadas al trabajador:', error);
              alert('Error al cargar sus tareas asignadas');
            }
          });
      }
    }
  }

  buscar(): void {
    this.currentPage.set(0);
    this.cargarTareas();
  }

  limpiar(): void {
    this.searchTerm = '';
    this.currentPage.set(0);
    this.cargarTareas();
  }

  cambiarPagina(page: number): void {
    if (page >= 0 && page < this.totalPages()) {
      this.currentPage.set(page);
      this.cargarTareas();
    }
  }

  nuevo(): void {
    if (!this.isAdmin) {
      alert('Operación no autorizada para este perfil');
      return;
    }
    this.router.navigate(['/tareas/nuevo']);
  }

  editar(id: number): void {
    if (!this.isAdmin) {
      alert('Operación no autorizada para este perfil');
      return;
    }
    this.router.navigate(['/tareas/editar', id]);
  }

  eliminar(id: number): void {
    if (!this.isAdmin) {
      alert('Operación no autorizada para este perfil');
      return;
    }
    if (confirm('¿Está seguro de que desea eliminar permanentemente esta tarea?')) {
      this.tareaService.eliminarTarea(id).subscribe({
        next: () => {
          alert('Tarea removida correctamente');
          this.cargarTareas();
        },
        error: (error) => {
          console.error('Error al remover la tarea:', error);
          alert('No se pudo eliminar la tarea seleccionada');
        }
      });
    }
  }

  getPaginas(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i);
  }
}