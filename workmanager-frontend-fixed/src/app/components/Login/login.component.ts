import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  error: string = '';
  cargando: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/trabajadores']);
    }
  }

  login(): void {
    if (!this.credentials.username || !this.credentials.password) {
      this.error = 'Por favor ingresa usuario y contraseña.';
      return;
    }
    this.cargando = true;
    this.error = '';

    this.authService.login(this.credentials).subscribe({
      next: (data) => {
        this.authService.guardarUsuario(data);
        this.router.navigate(['/trabajadores']);
      },
      error: (err) => {
        this.cargando = false;
        this.error = err.error || 'Usuario o contraseña incorrectos.';
      }
    });
  }

  irRegistro(): void {
    this.router.navigate(['/registro']);
  }
}
