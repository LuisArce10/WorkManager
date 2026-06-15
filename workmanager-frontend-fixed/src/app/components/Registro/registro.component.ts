import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  usuario = { username: '', password: '', confirmPassword: '' };
  error: string = '';
  exito: string = '';
  cargando: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  registrar(): void {
    this.error = '';
    this.exito = '';

    if (!this.usuario.username || !this.usuario.password) {
      this.error = 'Todos los campos son obligatorios.';
      return;
    }

    if (this.usuario.password !== this.usuario.confirmPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    if (this.usuario.password.length < 4) {
      this.error = 'La contraseña debe tener al menos 4 caracteres.';
      return;
    }

    this.cargando = true;

    const payload = {
      username: this.usuario.username,
      password: this.usuario.password
    };

    this.authService.registro(payload).subscribe({
      next: () => {
        this.cargando = false;
        this.exito = '¡Registro exitoso! Redirigiendo al login...';
        setTimeout(() => this.router.navigate(['/login']), 1800);
      },
      error: (err) => {
        this.cargando = false;
        this.error = err.error || 'Error al registrar. Intenta con otro nombre de usuario.';
      }
    });
  }

  irLogin(): void {
    this.router.navigate(['/login']);
  }
}
