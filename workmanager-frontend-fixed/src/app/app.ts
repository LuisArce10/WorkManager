import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('workmanager-frontend');

  constructor(private authService: AuthService) {
    const token = this.authService.getToken();
    if (token) {
      this.authService.me().subscribe({
        next: (u) => this.authService.guardarUsuario(u),
        error: () => this.authService.logout()
      });
    }
  }
}
