//servicios/producto.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private apiUrl = 'http://localhost:3000/api/catalogo';

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/productos`);
  }

  obtenerProductoPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/productos/${id}`);
  }
}
