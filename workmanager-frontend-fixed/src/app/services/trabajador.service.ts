import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trabajador } from '../models/trabajador.model';

@Injectable({
  providedIn: 'root'
})
export class TrabajadorService {
  private apiUrl = 'http://localhost:8080/api/trabajadores';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  listarTrabajadores(page: number = 0, size: number = 10, search?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<any>(this.apiUrl, { 
      params, 
      headers: this.getAuthHeaders() 
    });
  }

  obtenerTrabajador(id: number): Observable<Trabajador> {
    return this.http.get<Trabajador>(`${this.apiUrl}/${id}`, { 
      headers: this.getAuthHeaders() 
    });
  }

  crearTrabajador(trabajador: Trabajador): Observable<Trabajador> {
    return this.http.post<Trabajador>(this.apiUrl, trabajador, { 
      headers: this.getAuthHeaders() 
    });
  }

  // --- MÉTODO RECUPERADO ---
  actualizarTrabajador(id: number, trabajador: Trabajador): Observable<Trabajador> {
    return this.http.put<Trabajador>(`${this.apiUrl}/${id}`, trabajador, { 
      headers: this.getAuthHeaders() 
    });
  }

  // --- MÉTODO DE ACTIVACIÓN ---
  activarTrabajador(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/activar/${id}`, {}, { 
      headers: this.getAuthHeaders() 
    });
  }

  eliminarTrabajador(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { 
      headers: this.getAuthHeaders() 
    });
  }
}