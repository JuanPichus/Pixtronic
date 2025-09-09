import { Injectable } from '@angular/core';
import { Producto } from '../modelos/producto';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private productos: Producto[] = [
    { id: 1, nombre: 'Laptop', precio: 2500 },
    { id: 2, nombre: 'Celular', precio: 1200 },
  ];
  constructor() {}
  getProductos(): Producto[] {
    return this.productos;
  }
}
