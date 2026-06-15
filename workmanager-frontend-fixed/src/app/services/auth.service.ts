import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  registro(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, usuario);
  }

  guardarUsuario(usuario: any): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  getCurrentUser(): any {
    const u = localStorage.getItem('usuario');
    return u ? JSON.parse(u) : null;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.roles) return false;
    return user.roles.some((r: any) => r.nombre === 'ROLE_ADMIN');
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  logout(): void {
    localStorage.removeItem('usuario');
  }
}