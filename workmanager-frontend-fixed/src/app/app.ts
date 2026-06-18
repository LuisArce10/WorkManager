import { Component, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Necesario para *ngIf y ngClass
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('workmanager-frontend');

  constructor(public authService: AuthService, private router: Router) {
    const token = this.authService.getToken();
    if (token) {
      this.authService.me().subscribe({
        next: (u) => this.authService.guardarUsuario(u),
        error: () => this.authService.logout()
      });
    }
  }

  obtenerNombreUsuario(): string {
    const usuario = this.authService.getCurrentUser();
    return usuario?.username ? usuario.username.toUpperCase() : 'USUARIO';
  }

  irA(ruta: string): void {
    this.router.navigate([ruta]);
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}