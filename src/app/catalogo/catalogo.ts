//app/catalogo/catalogo.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosService } from '../servicios/productos';
import { CarritoService } from '../servicios/carrito.service';
import { Producto } from '../modelos/producto';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalogo.html',
  styleUrls: ['./catalogo.css']
})
export class CatalogoComponent implements OnInit {
  productos: Producto[] = [];
  private carritoService = inject(CarritoService);
  mensajeAgregado: string = '';

  constructor(private productosService: ProductosService) {}

  ngOnInit(): void {
    this.productosService.obtenerProductos().subscribe({
      next: (response: any) => {
        this.productos = Array.isArray(response.productos) ? response.productos : [];
        console.log('Productos cargados:', this.productos);
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.productos = [];
      }
    });
  }

  agregarAlCarrito(producto: Producto): void {
    this.carritoService.agregar(producto);
    this.mensajeAgregado = `${producto.nombre} agregado al carrito`;
    
    setTimeout(() => {
      this.mensajeAgregado = '';
    }, 2000);
  }

  // Método trackBy para optimizar el *ngFor
  trackById(index: number, producto: Producto): number {
    return producto.id;
  }
}
