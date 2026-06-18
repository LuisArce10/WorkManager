import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TrabajadorService } from '../../services/trabajador.service';
import { Trabajador } from '../../models/trabajador.model';

@Component({
  selector: 'app-trabajador-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trabajador-detalle.component.html',
  styleUrls: ['./trabajador-detalle.component.css']
})
export class TrabajadorDetalleComponent implements OnInit {
  trabajador = signal<Trabajador | undefined>(undefined);
  id: number = 0;

  constructor(
    private trabajadorService: TrabajadorService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarTrabajador();
  }

  cargarTrabajador(): void {
    this.trabajadorService.obtenerTrabajador(this.id).subscribe({
      next: (data) => {
        this.trabajador.set(data);
      },
      error: (error) => {
        console.error('Error al cargar trabajador:', error);
        alert('Error al cargar el trabajador');
        this.volver();
      }
    });
  }

  volver(): void {
    this.router.navigate(['/trabajadores']);
  }

  editar(): void {
    this.router.navigate(['/trabajadores/editar', this.id]);
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
