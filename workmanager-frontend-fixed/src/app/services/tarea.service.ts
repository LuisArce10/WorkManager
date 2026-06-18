import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarea } from '../models/tarea.model';

@Injectable({ providedIn: 'root' })
export class TareaService {
  private apiUrl = 'http://localhost:8080/api/tareas';

  constructor(private http: HttpClient) { }

  listarTareas(page: number = 0, size: number = 10, search?: string): Observable<any> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    if (search) params = params.set('search', search);
    return this.http.get<any>(this.apiUrl, { params });
  }

  obtenerTarea(id: number) {
    return this.http.get<Tarea>(`${this.apiUrl}/${id}`);
  }

  crearTarea(tarea: Tarea) {
    return this.http.post<Tarea>(this.apiUrl, tarea);
  }

  actualizarTarea(id: number, tarea: Tarea) {
    return this.http.put<Tarea>(`${this.apiUrl}/${id}`, tarea);
  }

  eliminarTarea(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  listarTareasPorTrabajador(trabajadorId: number, page: number, size: number, search: string = ''): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/trabajador/${trabajadorId}?page=${page}&size=${size}&search=${search}`);
}
}
