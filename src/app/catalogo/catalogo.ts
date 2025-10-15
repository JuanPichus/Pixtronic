import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { Producto } from '../modelos/producto';
import { Productos } from '../servicios/productos';
import { CarritoService } from '../servicios/carrito.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.html',
  styleUrls: ['./catalogo.css'],
  standalone: true,
  imports: [CommonModule],
})
export class Catalogo implements OnInit {
  productos: Producto[] = [];
  loading = true;
  error: string | null = null;
  private carritoService = inject(CarritoService);
  constructor(private productosService: Productos, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.productosService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.error = 'Error al cargar los productos';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
  agregar(producto: Producto) {
    this.carritoService.agregar(producto);
  }

  trackById(index: number, producto: Producto): number {
    return producto.id;
  }
}
