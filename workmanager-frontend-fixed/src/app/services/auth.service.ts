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

  me(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`);
  }
  guardarUsuario(usuario: any): void {
    const token = usuario?.token || usuario?.accessToken || null;
    if (token) {
      localStorage.setItem('token', token);
    }

    const userObj = {
      username: usuario?.username || usuario?.user?.username || null,
      roles: usuario?.roles || usuario?.user?.roles || null
    };
    localStorage.setItem('usuario', JSON.stringify(userObj));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): any {
    const u = localStorage.getItem('usuario');
    return u ? JSON.parse(u) : null;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.roles) return false;
    return user.roles.some((r: any) => {
      if (!r) return false;
      if (typeof r === 'string') return r === 'ROLE_ADMIN';
      if (r.nombre) return r.nombre === 'ROLE_ADMIN';
      if (r.authority) return r.authority === 'ROLE_ADMIN';
      return false;
    });
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null || this.getCurrentUser() !== null;
  }

  logout(): void {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
  }
}