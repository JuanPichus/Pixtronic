import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../modelos/producto';

@Injectable({
  providedIn: 'root',
})
export class InventarioService {
  private apiUrl = 'http://localhost:3000/api/inventario';

  constructor(private http: HttpClient) {}

  obtenerTodosProductos(filtros?: any): Observable<any> {
    let params = '';
    if (filtros) {
      const queryParams = new URLSearchParams();
      if (filtros.tipo) queryParams.append('tipo', filtros.tipo);
      if (filtros.nombre) queryParams.append('nombre', filtros.nombre);
      if (filtros.marca) queryParams.append('marca', filtros.marca);
      if (filtros.id) queryParams.append('id', filtros.id);
      params = queryParams.toString() ? `?${queryParams.toString()}` : '';
    }
    return this.http.get(`${this.apiUrl}/productos${params}`);
  }

  agregarProducto(producto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/productos`, producto);
  }

  modificarProducto(id: number, producto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/productos/${id}`, producto);
  }

  eliminarProducto(nombre: string, cantidad?: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/productos`, { 
      body: { nombre, cantidad } 
    });
  }
}