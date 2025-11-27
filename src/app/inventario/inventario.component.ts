// filepath: src/app/inventario/inventario.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventarioService } from '../servicios/inventario.service';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
  productos: any[] = [];
  mensaje: string = '';
  error: string = '';

  nuevoProducto = {
    nombre: '',
    marca: '',
    tipo: '',
    precio: null as number | null,  // Cambiado a null
    cantidad: null as number | null, // Cambiado a null
    vigente: 1
  };

  productoEliminar = {
    nombre: '',
    cantidad: undefined as number | undefined
  };

  filtros = {
    nombre: '',
    marca: '',
    tipo: '',
    id: undefined as number | undefined
  };

  productoEditando: any = null;

  constructor(private inventarioService: InventarioService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(filtros?: any): void {
    this.inventarioService.obtenerTodosProductos(filtros).subscribe({
      next: (response: any) => {
        this.productos = response.productos || [];
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.mostrarError('Error al cargar productos');
      }
    });
  }

  agregarProducto(): void {
    // RNF 2.1 - VALIDACIÓN DE CAMPOS
    if (!this.nuevoProducto.nombre || !this.nuevoProducto.marca || !this.nuevoProducto.tipo) {
      alert('Todos los campos son obligatorios. Por favor, complete el formulario.');
      return;
    }

    if (this.nuevoProducto.precio === null || this.nuevoProducto.precio === undefined) {
      alert('El precio es obligatorio.');
      return;
    }

    if (this.nuevoProducto.cantidad === null || this.nuevoProducto.cantidad === undefined) {
      alert('La cantidad es obligatoria.');
      return;
    }

    // RNF 2.2 - VALIDACIÓN DE CANTIDAD (solo cuando tiene valor)
    if (!Number.isInteger(Number(this.nuevoProducto.cantidad))) {
      alert('La cantidad debe ser un número entero.');
      return;
    }

    if (Number(this.nuevoProducto.cantidad) <= 0) {
      alert('La cantidad debe ser mayor a 0.');
      return;
    }

    // Validación de precio
    if (Number(this.nuevoProducto.precio) <= 0) {
      alert('El precio debe ser mayor a 0.');
      return;
    }

    this.inventarioService.agregarProducto(this.nuevoProducto).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.mostrarMensaje('Producto agregado exitosamente');
          this.limpiarFormulario();
          this.cargarProductos(this.obtenerFiltrosActivos());
        }
      },
      error: (error) => {
        alert('Error: ' + (error.error?.message || 'Error al agregar producto'));
        this.mostrarError(error.error?.message || 'Error al agregar producto');
      }
    });
  }

  editarProducto(producto: any): void {
    this.productoEditando = { ...producto };
    this.nuevoProducto = {
      nombre: producto.nombre,
      marca: producto.marca,
      tipo: producto.tipo,
      precio: producto.precio,
      cantidad: producto.cantidad,
      vigente: producto.vigente
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  modificarProducto(): void {
    if (!this.productoEditando) return;

    // RNF 2.1 - VALIDACIÓN DE CAMPOS
    if (!this.nuevoProducto.nombre || !this.nuevoProducto.marca || !this.nuevoProducto.tipo) {
      alert('Todos los campos son obligatorios. Por favor, complete el formulario.');
      return;
    }

    if (this.nuevoProducto.precio === null || this.nuevoProducto.precio === undefined) {
      alert('El precio es obligatorio.');
      return;
    }

    if (this.nuevoProducto.cantidad === null || this.nuevoProducto.cantidad === undefined) {
      alert('La cantidad es obligatoria.');
      return;
    }

    // RNF 2.2 - VALIDACIÓN DE CANTIDAD
    if (!Number.isInteger(Number(this.nuevoProducto.cantidad))) {
      alert('La cantidad debe ser un número entero.');
      return;
    }

    if (Number(this.nuevoProducto.cantidad) <= 0) {
      alert('La cantidad debe ser mayor a 0.');
      return;
    }

    // Validación de precio
    if (Number(this.nuevoProducto.precio) <= 0) {
      alert('El precio debe ser mayor a 0.');
      return;
    }

    this.inventarioService.modificarProducto(
      this.productoEditando.id_producto, 
      this.nuevoProducto
    ).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.mostrarMensaje('Producto modificado exitosamente');
          this.cancelarEdicion();
          this.cargarProductos(this.obtenerFiltrosActivos());
        }
      },
      error: (error) => {
        alert('Error: ' + (error.error?.message || 'Error al modificar producto'));
        this.mostrarError(error.error?.message || 'Error al modificar producto');
      }
    });
  }

  eliminarProducto(): void {
    if (!this.productoEliminar.nombre.trim()) {
      alert('El nombre del producto es obligatorio.');
      this.mostrarError('El nombre del producto es obligatorio');
      return;
    }

    this.inventarioService.eliminarProducto(
      this.productoEliminar.nombre, 
      this.productoEliminar.cantidad
    ).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.mostrarMensaje('Producto eliminado/actualizado exitosamente');
          this.productoEliminar = { nombre: '', cantidad: undefined };
          this.cargarProductos(this.obtenerFiltrosActivos());
        }
      },
      error: (error) => {
        alert('Error: ' + (error.error?.message || 'Error al eliminar producto'));
        console.error('Error al eliminar producto:', error);
        this.mostrarError(error.error?.message || 'Error al eliminar producto');
      }
    });
  }

  aplicarFiltros(): void {
    this.cargarProductos(this.obtenerFiltrosActivos());
  }

  limpiarFiltros(): void {
    this.filtros = {
      nombre: '',
      marca: '',
      tipo: '',
      id: undefined
    };
    this.cargarProductos();
  }

  cancelarEdicion(): void {
    this.productoEditando = null;
    this.limpiarFormulario();
  }

  limpiarFormulario(): void {
    this.nuevoProducto = {
      nombre: '',
      marca: '',
      tipo: '',
      precio: null,    // Cambiado a null
      cantidad: null,  // Cambiado a null
      vigente: 1
    };
  }

  obtenerFiltrosActivos(): any {
    const filtrosActivos: any = {};
    if (this.filtros.nombre) filtrosActivos.nombre = this.filtros.nombre;
    if (this.filtros.marca) filtrosActivos.marca = this.filtros.marca;
    if (this.filtros.tipo) filtrosActivos.tipo = this.filtros.tipo;
    if (this.filtros.id) filtrosActivos.id = this.filtros.id;
    return Object.keys(filtrosActivos).length > 0 ? filtrosActivos : undefined;
  }

  mostrarMensaje(mensaje: string): void {
    this.mensaje = mensaje;
    this.error = '';
    setTimeout(() => {
      this.mensaje = '';
    }, 3000);
  }

  mostrarError(error: string): void {
    this.error = error;
    this.mensaje = '';
    setTimeout(() => {
      this.error = '';
    }, 3000);
  }
}