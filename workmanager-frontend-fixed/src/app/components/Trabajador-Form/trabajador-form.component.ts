import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrabajadorService } from '../../services/trabajador.service';
import { Trabajador } from '../../models/trabajador.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-trabajador-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trabajador-form.component.html',
  styleUrls: ['./trabajador-form.component.css']
})
export class TrabajadorFormComponent implements OnInit {

  trabajador = signal<Trabajador>({
    nombre: '',
    apellido: '',
    email: '',
    telefono: 0,
    sexo: 'Masculino',
    salario: 0,
    fecha: new Date().toISOString().split('T')[0],
    estado: 'ACTIVO'
  });

  esAdmin = false;
  esEdicion = false;
  id?: number;

  estados = ['ACTIVO', 'VACACIONES', 'SUSPENDIDO', 'CESADO'];

  constructor(
    private trabajadorService: TrabajadorService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.esAdmin = this.authService.isAdmin();
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.esEdicion = true;
      this.cargarTrabajador();
    }
  }

  cargarTrabajador(): void {
    this.trabajadorService.obtenerTrabajador(this.id!).subscribe({
      next: (data) => {
        data.fecha = new Date(data.fecha).toISOString().split('T')[0];
        this.trabajador.set(data);
      }
    });
  }

  actualizarCampo<K extends keyof Trabajador>(campo: K, valor: Trabajador[K]): void {
    this.trabajador.update(t => ({ ...t, [campo]: valor }));
  }

  guardar(): void {
    if (!this.esAdmin) {
      alert('Solo ADMIN puede guardar');
      return;
    }

    const accion = this.esEdicion
      ? this.trabajadorService.actualizarTrabajador(this.id!, this.trabajador())
      : this.trabajadorService.crearTrabajador(this.trabajador());

    accion.subscribe(() => this.volver());
  }

  volver(): void {
    this.router.navigate(['/trabajadores']);
  }
}
