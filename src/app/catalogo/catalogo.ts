import { Component, OnInit } from '@angular/core';
import { Producto } from '../modelos/producto';
import { ProductoService } from '../servicios/producto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-catalogo',
  imports: [CommonModule],
  templateUrl: './catalogo.html',
  styleUrls: ['./catalogo.css'],
})
export class CatalogoComponent implements OnInit {
  productos: Producto[] = [];
  constructor(private productoService: ProductoService) {}
  ngOnInit(): void {
    this.productos = this.productoService.getProductos();
  }
}
