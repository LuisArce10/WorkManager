import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrabajadorService } from '../../services/trabajador.service';
import { AuthService } from '../../services/auth.service';
import { Trabajador } from '../../models/trabajador.model';

@Component({
  selector: 'app-trabajador-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trabajador-lista.component.html',
  styleUrls: ['./trabajador-lista.component.css']
})
export class TrabajadorListaComponent implements OnInit {
  trabajadores = signal<Trabajador[]>([]);
  currentPage = signal<number>(0);
  totalPages = signal<number>(0);
  totalItems = signal<number>(0);
  pageSize = 10;
  searchTerm = signal<string>('');

  isAdmin: boolean = false;
  currentUser: any;
  vistaActual: string = 'ver';

  constructor(
    private trabajadorService: TrabajadorService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.checkUserRole();
    this.cargarTrabajadores();
  }

  checkUserRole(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = this.authService.isAdmin();
  }

  cambiarVista(vista: string): void {
    this.vistaActual = vista;
  }

  obtenerTituloVista(): string {
    switch (this.vistaActual) {
      case 'ver': return '(Modo: Ver Detalles)';
      case 'editar': return '(Modo: Editar)';
      case 'eliminar': return '(Modo: Ceses)';
      default: return '';
    }
  }

  obtenerTituloColumnaAccion(): string {
    switch (this.vistaActual) {
      case 'ver': return 'DETALLES';
      case 'editar': return 'EDITAR';
      case 'eliminar': return 'CESAR';
      default: return 'ACCIÓN';
    }
  }

  cargarTrabajadores(): void {
    this.trabajadorService.listarTrabajadores(this.currentPage(), this.pageSize, this.searchTerm())
      .subscribe({
        next: (data) => {
          this.trabajadores.set(data.trabajadores);
          this.currentPage.set(data.currentPage);
          this.totalPages.set(data.totalPages);
          this.totalItems.set(data.totalItems);
        },
        error: (error) => {
          console.error('Error al cargar trabajadores:', error);
          alert('Error al cargar los trabajadores');
        }
      });
  }

  onSearchTermChange(value: string): void {
    this.searchTerm.set(value);
  }

  buscar(): void {
    this.currentPage.set(0);
    this.cargarTrabajadores();
  }

  limpiarBusqueda(): void {
    this.searchTerm.set('');
    this.currentPage.set(0);
    this.cargarTrabajadores();
  }

  cambiarPagina(page: number): void {
    if (page >= 0 && page < this.totalPages()) {
      this.currentPage.set(page);
      this.cargarTrabajadores();
    }
  }

  verDetalle(id: number): void {
    this.router.navigate(['/trabajadores/detalle', id]);
  }

  editar(id: number): void {
    if (!this.isAdmin) {
      alert('No tienes permisos para editar trabajadores');
      return;
    }
    this.router.navigate(['/trabajadores/editar', id]);
  }

  eliminar(id: number): void {
    if (!this.isAdmin) {
      alert('No tienes permisos para cesar trabajadores');
      return;
    }
    if (confirm('¿Estás seguro de cesar al trabajador? Esta acción no elimina sus datos, solo lo marca como CESADO.')) {
      this.trabajadorService.cambiarEstado(id, 'CESADO').subscribe({
        next: (data) => {
          alert(data?.mensaje || 'Trabajador cesado exitosamente');
          this.cargarTrabajadores();
        },
        error: (error) => {
          console.error('Error al cesar:', error);
          alert(error?.error?.error || 'Error al cesar el trabajador');
        }
      });
    }
  }

  nuevo(): void {
    if (!this.isAdmin) {
      alert('No tienes permisos para agregar trabajadores');
      return;
    }
    this.router.navigate(['/trabajadores/nuevo']);
  }

  logout(): void {
    if (confirm('¿Está seguro de cerrar sesión?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }

  getPaginas(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i);
  }

  getEstadoBadge(estado: string): string {
    switch (estado) {
      case 'ACTIVO': return 'badge-activo';
      case 'VACACIONES': return 'badge-vacaciones';
      case 'SUSPENDIDO': return 'badge-suspendido';
      case 'CESADO': return 'badge-cesado';
      default: return '';
    }
  }
}
