# 📦 Sistema de Gestión de Inventario - Pixtronic

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Documentación Técnica Backend](#documentación-técnica-backend)
- [Documentación Técnica Frontend](#documentación-técnica-frontend)
- [Flujo de Datos](#flujo-de-datos)
- [Seguridad](#seguridad)
- [Patrones de Diseño](#patrones-de-diseño)
- [Optimizaciones Futuras](#optimizaciones-futuras)

---

## 📖 Descripción General

Sistema de gestión de inventario para administradores que permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre productos en una base de datos MySQL. Los usuarios regulares solo pueden visualizar el catálogo, mientras que los administradores tienen acceso completo a la gestión de inventario.

### Requerimientos Funcionales Implementados

| RF  | Descripción                                                                                                                          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 2.1 | **Añadir productos**: Administrador puede añadir productos con campos obligatorios (nombre, marca, tipo, precio, vigencia, cantidad) |
| 2.2 | **Eliminación de productos**: Administrador puede marcar productos como no vigentes o reducir cantidad                               |
| 2.3 | **Modificar productos**: Administrador puede editar todos los campos de un producto                                                  |
| 2.4 | **Lectura de productos**: Administrador puede ver y filtrar productos por tipo, nombre, marca e ID                                   |

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────┐
│                   FRONTEND                      │
│              (Angular Standalone)               │
│                Port: 4200                       │
├─────────────────────────────────────────────────┤
│  InventarioComponent → InventarioService        │
│         ↓                      ↓                │
│    Template HTML          HTTP Client           │
└─────────────────────────────────────────────────┘
                      ↓
              HTTP REST API
                      ↓
┌─────────────────────────────────────────────────┐
│                   BACKEND                       │
│              (Node.js/Express)                  │
│                Port: 3000                       │
├─────────────────────────────────────────────────┤
│  app.js → inventarioRoutes → inventarioController│
│                              ↓                  │
│                         MySQL Database          │
│                         (XAMPP)                 │
└─────────────────────────────────────────────────┘
```

### Stack Tecnológico

**Backend:**

- Node.js v18+
- Express.js v4.18+
- MySQL2 (Promises)
- dotenv (Configuración)
- CORS

**Frontend:**

- Angular 17+ (Standalone Components)
- TypeScript 5+
- RxJS 7+
- HttpClient
- FormsModule

**Base de Datos:**

- MySQL 8.0+ (via XAMPP)

---

## 📋 Requisitos Previos

- **Node.js** >= 18.0.0
- **Angular CLI** >= 17.0.0
- **XAMPP** (MySQL)
- **npm** o **yarn**

### Verificar Instalación

```bash
node --version
npm --version
ng version
```

---

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/pixtronic.git
cd pixtronic
```

### 2. Configurar Base de Datos

#### Iniciar MySQL en XAMPP

1. Abrir XAMPP Control Panel
2. Iniciar Apache y MySQL
3. Acceder a phpMyAdmin: `http://localhost/phpmyadmin`

#### Crear Base de Datos y Tabla

```sql
CREATE DATABASE IF NOT EXISTS pixtronic;
USE pixtronic;

CREATE TABLE IF NOT EXISTS producto (
  id_producto INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  marca VARCHAR(100) NOT NULL,
  tipo VARCHAR(100) NOT NULL,
  precio DECIMAL(10, 2) NOT NULL,
  vigente TINYINT(1) DEFAULT 1,
  cantidad INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cliente (
  id_cliente INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  admin TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear usuario administrador de prueba
INSERT INTO cliente (username, email, password, admin)
VALUES ('admin', 'admin@pixtronic.com', 'admin123', 1);
```

### 3. Configurar Backend

```bash
cd api
npm install
```

#### Crear archivo `.env`

```env
# api/.env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=pixtronic
DB_PORT=3306
PORT=3000
```

### 4. Configurar Frontend

```bash
cd ..
npm install
```

### 5. Ejecutar el Proyecto

#### Terminal 1 - Backend

```bash
cd api
node app.js
```

Deberías ver:

```
Servidor corriendo en puerto 3000
```

#### Terminal 2 - Frontend

```bash
ng serve
```

Deberías ver:

```
** Angular Live Development Server is listening on localhost:4200 **
```

### 6. Acceder a la Aplicación

1. Abrir navegador en `http://localhost:4200`
2. Iniciar sesión con:
   - **Email**: admin@pixtronic.com
   - **Password**: admin123
3. Acceder a **Gestión de Inventario** desde el navbar

---

## 📁 Estructura del Proyecto

```
Pixtronic/
├── api/                                # Backend
│   ├── config/
│   │   └── db.js                       # Configuración MySQL
│   ├── controllers/
│   │   ├── catalogoController.js       # Lógica de catálogo
│   │   ├── inventarioController.js     # Lógica de inventario (NUEVO)
│   │   ├── pedidoController.js         # Lógica de pedidos
│   │   └── registroController.js       # Lógica de autenticación
│   ├── routes/
│   │   ├── catalogoRoutes.js           # Rutas de catálogo
│   │   ├── inventarioRoutes.js         # Rutas de inventario (NUEVO)
│   │   ├── pedidoRoutes.js             # Rutas de pedidos
│   │   └── registroRoutes.js           # Rutas de autenticación
│   ├── .env                            # Variables de entorno
│   ├── app.js                          # Punto de entrada
│   └── package.json
│
├── src/                                # Frontend
│   ├── app/
│   │   ├── carrito/                    # Componente carrito
│   │   ├── catalogo/                   # Componente catálogo
│   │   ├── inventario/                 # Componente inventario (NUEVO)
│   │   │   ├── inventario.component.ts
│   │   │   ├── inventario.component.html
│   │   │   └── inventario.component.css
│   │   ├── login/                      # Componente login
│   │   ├── registro/                   # Componente registro
│   │   ├── recuperar-password/         # Componente recuperar password
│   │   ├── modelos/                    # Interfaces TypeScript
│   │   ├── servicios/                  # Servicios Angular
│   │   │   ├── autenticacion.service.ts
│   │   │   ├── catalogo.service.ts
│   │   │   ├── inventario.service.ts   # Servicio inventario (NUEVO)
│   │   │   └── pedido.service.ts
│   │   ├── app.component.ts            # Componente raíz
│   │   ├── app.component.html
│   │   ├── app.component.css
│   │   ├── app.config.ts
│   │   └── app.routes.ts               # Rutas de navegación
│   ├── assets/                         # Recursos estáticos
│   ├── index.html
│   └── main.ts
│
├── angular.json
├── package.json
├── tsconfig.json
└── README.md                           # Este archivo
```

---

## 🔧 Documentación Técnica Backend

### 1. Punto de Entrada - `api/app.js`

**Propósito**: Configurar y levantar el servidor Express con middlewares y rutas.

```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import inventarioRoutes from './routes/inventarioRoutes.js';

dotenv.config(); // Carga variables de .env

const app = express();

// MIDDLEWARES
app.use(cors()); // Permite peticiones desde localhost:4200
app.use(express.json()); // Parsea body como JSON

// RUTAS
app.use('/api', inventarioRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
```

**Conceptos Clave:**

- **`cors()`**: Habilita Cross-Origin Resource Sharing para comunicación entre puertos
- **`express.json()`**: Convierte automáticamente el body de peticiones a objetos JavaScript
- **`dotenv.config()`**: Carga credenciales sensibles desde archivo `.env`

---

### 2. Rutas - `api/routes/inventarioRoutes.js`

**Propósito**: Mapear URLs HTTP a funciones controladoras.

```javascript
import express from 'express';
import * as inventarioController from '../controllers/inventarioController.js';

const router = express.Router();

// CRUD de productos
router.get('/inventario/productos', inventarioController.obtenerTodosProductos);
router.post('/inventario/productos', inventarioController.agregarProducto);
router.put('/inventario/productos/:id', inventarioController.modificarProducto);
router.delete('/inventario/productos', inventarioController.eliminarProducto);

export default router;
```

#### Tabla de Endpoints

| Método | Endpoint                        | Controlador             | Descripción                            |
| ------ | ------------------------------- | ----------------------- | -------------------------------------- |
| GET    | `/api/inventario/productos`     | `obtenerTodosProductos` | Lista productos con filtros opcionales |
| POST   | `/api/inventario/productos`     | `agregarProducto`       | Crea nuevo producto                    |
| PUT    | `/api/inventario/productos/:id` | `modificarProducto`     | Actualiza producto existente           |
| DELETE | `/api/inventario/productos`     | `eliminarProducto`      | Marca producto como no vigente         |

**Tipos de Parámetros:**

- **Route Parameters** (`:id`): Accesibles en `req.params.id`
- **Query Parameters** (`?tipo=laptop`): Accesibles en `req.query.tipo`
- **Body** (JSON): Accesible en `req.body`

---

### 3. Controlador - `api/controllers/inventarioController.js`

#### 3.1 Obtener Productos con Filtros Dinámicos

```javascript
export const obtenerTodosProductos = async (req, res) => {
  const { tipo, nombre, marca, id } = req.query;

  try {
    let query =
      'SELECT id_producto, nombre, marca, tipo, precio, vigente, cantidad FROM producto WHERE 1=1';
    const params = [];

    // Construcción dinámica de WHERE clauses
    if (tipo) {
      query += ' AND tipo = ?';
      params.push(tipo);
    }
    if (nombre) {
      query += ' AND nombre LIKE ?';
      params.push(`%${nombre}%`); // Búsqueda parcial
    }
    if (marca) {
      query += ' AND marca LIKE ?';
      params.push(`%${marca}%`);
    }
    if (id) {
      query += ' AND id_producto = ?';
      params.push(id);
    }

    query += ' ORDER BY id_producto DESC';

    const [productos] = await db.query(query, params);

    res.json({ success: true, productos });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Error al obtener productos' });
  }
};
```

**Conceptos Técnicos:**

1. **Prepared Statements** (`db.query(query, params)`):

   - Previene SQL Injection
   - Los `?` son placeholders reemplazados por valores de `params`

2. **Operador LIKE**:

   - `%${nombre}%` permite búsquedas parciales
   - Ejemplo: "Laptop" encuentra "Laptop Dell XPS"

3. **Destructuring** (`const [productos] = ...`):

   - `db.query()` retorna `[rows, fields]`
   - Solo extraemos `rows`

4. **Query String Parsing**:
   - Express convierte `?tipo=laptop&marca=dell` en `{ tipo: 'laptop', marca: 'dell' }`

---

#### 3.2 Agregar Producto con Validación

```javascript
export const agregarProducto = async (req, res) => {
  const { nombre, marca, tipo, precio, vigente, cantidad } = req.body;

  try {
    // Validación de campos obligatorios
    if (
      !nombre ||
      !marca ||
      !tipo ||
      precio === undefined ||
      vigente === undefined ||
      cantidad === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son obligatorios',
      });
    }

    const [result] = await db.query(
      'INSERT INTO producto (nombre, marca, tipo, precio, vigente, cantidad) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, marca, tipo, parseFloat(precio), parseInt(vigente), parseInt(cantidad)]
    );

    res.status(201).json({
      success: true,
      message: 'Producto agregado exitosamente',
      id_producto: result.insertId, // ID auto-incremental generado
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Error al agregar producto' });
  }
};
```

**Conceptos Clave:**

1. **Validación de Entrada**:

   - `precio === undefined` vs `!precio`: Distingue `0` (válido) de `undefined` (inválido)

2. **Type Casting**:

   - `parseFloat(precio)`: Asegura tipo numérico
   - `parseInt(vigente)`: Convierte booleanos/strings a enteros (0 o 1)

3. **HTTP Status Codes**:

   - `201`: Recurso creado exitosamente
   - `400`: Bad Request (error del cliente)
   - `500`: Internal Server Error

4. **`result.insertId`**:
   - MySQL retorna el ID del registro insertado
   - Útil para confirmación

---

#### 3.3 Modificar Producto

```javascript
export const modificarProducto = async (req, res) => {
  const { id } = req.params; // Extraído de la URL
  const { nombre, marca, tipo, precio, vigente, cantidad } = req.body;

  try {
    if (
      !nombre ||
      !marca ||
      !tipo ||
      precio === undefined ||
      vigente === undefined ||
      cantidad === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son obligatorios',
      });
    }

    const [result] = await db.query(
      'UPDATE producto SET nombre = ?, marca = ?, tipo = ?, precio = ?, vigente = ?, cantidad = ? WHERE id_producto = ?',
      [nombre, marca, tipo, parseFloat(precio), parseInt(vigente), parseInt(cantidad), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }

    res.json({ success: true, message: 'Producto modificado exitosamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Error al modificar producto' });
  }
};
```

**Conceptos Técnicos:**

1. **Route Parameters**:

   - URL: `/api/inventario/productos/5` → `req.params.id = '5'`

2. **`affectedRows`**:
   - Propiedad MySQL que indica filas modificadas
   - Si es 0, el ID no existe → retornamos 404

---

#### 3.4 Eliminar Producto (Soft Delete)

```javascript
export const eliminarProducto = async (req, res) => {
  const { nombre, cantidad } = req.body;

  try {
    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: 'El nombre del producto es obligatorio',
      });
    }

    if (cantidad !== undefined) {
      const cantidadEliminar = parseInt(cantidad);

      // Obtener cantidad actual
      const [productos] = await db.query(
        'SELECT id_producto, cantidad FROM producto WHERE nombre = ?',
        [nombre]
      );

      if (productos.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado',
        });
      }

      const producto = productos[0];
      const nuevaCantidad = producto.cantidad - cantidadEliminar;

      if (nuevaCantidad <= 0) {
        // Stock agotado → marcar como no vigente
        await db.query('UPDATE producto SET cantidad = 0, vigente = 0 WHERE id_producto = ?', [
          producto.id_producto,
        ]);
      } else {
        // Solo reducir cantidad
        await db.query('UPDATE producto SET cantidad = ? WHERE id_producto = ?', [
          nuevaCantidad,
          producto.id_producto,
        ]);
      }
    } else {
      // Marcar todos como no vigente
      const [result] = await db.query('UPDATE producto SET vigente = 0 WHERE nombre = ?', [nombre]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado',
        });
      }
    }

    res.json({
      success: true,
      message: 'Producto eliminado/actualizado exitosamente',
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar producto' });
  }
};
```

**Conceptos Avanzados:**

1. **Soft Delete**:

   - No usa `DELETE FROM producto`
   - Marca `vigente = 0` para mantener historial

2. **Lógica Condicional**:

   - Con cantidad: Reduce stock
   - Si llega a 0: Marca como no vigente
   - Sin cantidad: Marca todo como no vigente

3. **Múltiples Queries**:
   - SELECT para verificar existencia
   - UPDATE para modificar

---

## 🎨 Documentación Técnica Frontend

### 4. Servicio HTTP - `src/app/servicios/inventario.service.ts`

**Propósito**: Encapsular llamadas HTTP y proporcionar API limpia al componente.

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Singleton global
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
      body: { nombre, cantidad },
    });
  }
}
```

**Conceptos Técnicos:**

1. **`@Injectable({ providedIn: 'root' })`**:

   - Crea instancia única (Singleton)
   - Angular la inyecta automáticamente

2. **`Observable<any>`**:

   - Stream de datos asíncrono
   - Permite composición con operadores RxJS

3. **`URLSearchParams`**:

   - API nativa para construir query strings
   - Maneja encoding automático

4. **`http.delete()` con body**:
   - DELETE normalmente no lleva body
   - Angular requiere `{ body: { ... } }`

---

### 5. Componente - `src/app/inventario/inventario.component.ts`

#### 5.1 Configuración

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventarioService } from '../servicios/inventario.service';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css'],
})
export class InventarioComponent implements OnInit {
  productos: any[] = [];
  mensaje: string = '';
  error: string = '';

  nuevoProducto = {
    nombre: '',
    marca: '',
    tipo: '',
    precio: 0,
    cantidad: 0,
    vigente: 1,
  };

  productoEditando: any = null; // null = crear, objeto = editar

  constructor(private inventarioService: InventarioService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }
}
```

**Conceptos:**

1. **Standalone Components**:

   - No requieren NgModule
   - Importan dependencias directamente

2. **`ngOnInit()`**:

   - Lifecycle hook post-construcción
   - Ideal para cargas iniciales

3. **Two-Way Binding**:
   - `[(ngModel)]` sincroniza modelo ↔ vista

---

#### 5.2 Operaciones CRUD

##### Cargar Productos

```typescript
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
```

**Patrón Observer:**

- `subscribe({ next, error })`: Manejo moderno de observables
- `next`: Callback de éxito
- `error`: Callback de fallo

---

##### Agregar Producto

```typescript
agregarProducto(): void {
  this.inventarioService.agregarProducto(this.nuevoProducto).subscribe({
    next: (response: any) => {
      if (response.success) {
        this.mostrarMensaje('Producto agregado exitosamente');
        this.limpiarFormulario();
        this.cargarProductos(this.obtenerFiltrosActivos());
      }
    },
    error: (error) => {
      this.mostrarError(error.error?.message || 'Error al agregar producto');
    }
  });
}
```

**Flujo:**

1. Enviar datos al backend
2. Si exitoso: mensaje, limpiar, recargar
3. Si falla: mostrar error

---

##### Editar Producto (Modo Dual)

```typescript
editarProducto(producto: any): void {
  this.productoEditando = { ...producto }; // Copia
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
      this.mostrarError(error.error?.message || 'Error al modificar producto');
    }
  });
}
```

**Conceptos:**

1. **Spread Operator** (`{ ...producto }`):

   - Copia superficial del objeto
   - Evita mutaciones

2. **Estado Dual**:

   - `null`: Modo "Crear"
   - `objeto`: Modo "Editar"

3. **`window.scrollTo()`**:
   - API nativa del navegador
   - `behavior: 'smooth'` para animación

---

#### 5.3 Manejo de Filtros

```typescript
obtenerFiltrosActivos(): any {
  const filtrosActivos: any = {};
  if (this.filtros.nombre) filtrosActivos.nombre = this.filtros.nombre;
  if (this.filtros.marca) filtrosActivos.marca = this.filtros.marca;
  if (this.filtros.tipo) filtrosActivos.tipo = this.filtros.tipo;
  if (this.filtros.id) filtrosActivos.id = this.filtros.id;
  return Object.keys(filtrosActivos).length > 0 ? filtrosActivos : undefined;
}

aplicarFiltros(): void {
  this.cargarProductos(this.obtenerFiltrosActivos());
}

limpiarFiltros(): void {
  this.filtros = { nombre: '', marca: '', tipo: '', id: undefined };
  this.cargarProductos();
}
```

**Patrón Builder**:

- Construye dinámicamente objeto de filtros
- Solo incluye valores no vacíos

---

#### 5.4 Feedback de Usuario

```typescript
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
```

**Conceptos:**

- Mutual Exclusion: Solo un mensaje a la vez
- Auto-ocultamiento con `setTimeout()`

---

### 6. Template HTML - Directivas y Binding

#### Mensajes Condicionales

```html
<div *ngIf="mensaje" class="mensaje-exito">{{ mensaje }}</div>

<div *ngIf="error" class="mensaje-error">{{ error }}</div>
```

**`*ngIf`**: Renderizado condicional (structural directive)

---

#### Formulario con Two-Way Binding

```html
<form (ngSubmit)="productoEditando ? modificarProducto() : agregarProducto()">
  <input type="text" [(ngModel)]="nuevoProducto.nombre" name="nombre" required />

  <button type="submit">{{ productoEditando ? 'Guardar Cambios' : 'Agregar Producto' }}</button>
</form>
```

**Bindings:**

- `(ngSubmit)`: Event binding
- `[(ngModel)]`: Two-way binding
- `{{ }}`: Interpolation

---

#### Tabla de Productos

```html
<table>
  <tbody>
    <tr *ngFor="let producto of productos" [class.no-vigente]="producto.vigente === 0">
      <td>{{ producto.nombre }}</td>
      <td>
        <span [class.stock-bajo]="producto.cantidad < 5"> {{ producto.cantidad }} </span>
      </td>
      <td>
        <button (click)="editarProducto(producto)">Editar</button>
      </td>
    </tr>
  </tbody>
</table>
```

**Directivas:**

- `*ngFor`: Iteración sobre array
- `[class.nombre]`: Class binding condicional
- `{{ }}`: Interpolation

---

## 🔄 Flujo de Datos Completo

### Ejemplo: Agregar Producto

```
1. Usuario rellena formulario
   ↓
2. Click en "Agregar Producto"
   ↓
3. (ngSubmit) → agregarProducto()
   ↓
4. inventarioService.agregarProducto(nuevoProducto)
   ↓
5. HttpClient.post('http://localhost:3000/api/inventario/productos', body)
   ↓
6. [RED] → Express app.js
   ↓
7. Router: POST /api/inventario/productos → inventarioController.agregarProducto
   ↓
8. Validación de campos
   ↓
9. db.query('INSERT INTO producto ...', [valores])
   ↓
10. MySQL ejecuta INSERT
   ↓
11. Retorna { success: true, id_producto: 42 }
   ↓
12. res.json({ success: true, ... })
   ↓
13. [RED] → HttpClient Observable
   ↓
14. subscribe({ next: (response) => { ... } })
   ↓
15. this.mostrarMensaje('Producto agregado')
   ↓
16. this.cargarProductos() → Actualiza lista
   ↓
17. Angular detecta cambio y re-renderiza tabla
```

---

## 🔒 Seguridad y Buenas Prácticas

### 1. Prevención de SQL Injection

```javascript
// ❌ VULNERABLE
const query = `SELECT * FROM producto WHERE nombre = '${nombre}'`;

// ✅ SEGURO (Prepared Statements)
const [productos] = await db.query('SELECT * FROM producto WHERE nombre = ?', [nombre]);
```

**Por qué es seguro:**

- El driver MySQL escapa automáticamente
- Imposible inyectar comandos SQL

---

### 2. Validación de Datos

**Backend:**

```javascript
if (!nombre || !marca || precio === undefined) {
  return res.status(400).json({ message: 'Campos obligatorios' });
}
```

**Frontend:**

```html
<input required minlength="3" type="number" min="0" />
```

**Defensa en Profundidad:**

- Frontend: UX (feedback inmediato)
- Backend: Seguridad (nunca confiar en cliente)

---

### 3. CORS y Orígenes

**Desarrollo:**

```javascript
app.use(cors()); // Permite cualquier origen
```

**Producción:**

```javascript
app.use(
  cors({
    origin: 'https://tu-dominio.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
```

---

### 4. Manejo de Errores

```typescript
try {
  // Operación de BD
} catch (error) {
  console.error('Error detallado:', error); // Log para debugging
  res.status(500).json({
    success: false,
    message: 'Error genérico', // Cliente
  });
}
```

**Principio:** Nunca exponer detalles internos al cliente.

---

## 🎯 Patrones de Diseño Utilizados

### 1. MVC (Model-View-Controller)

- **Model**: Base de datos MySQL
- **View**: Templates HTML Angular
- **Controller**: Controllers Express + Components Angular

### 2. Repository Pattern

- `InventarioService` abstrae acceso a datos

### 3. Dependency Injection

- Angular inyecta servicios
- Express inyecta middlewares

### 4. Observer Pattern

- RxJS Observables para asincronía

### 5. Singleton Pattern

- Servicios Angular (`providedIn: 'root'`)

---

## 🚀 Optimizaciones Futuras

### 1. Paginación

```javascript
const limit = 20;
const offset = (page - 1) * limit;
query += ` LIMIT ${limit} OFFSET ${offset}`;
```

### 2. Caché

```typescript
private cache: Map<string, any> = new Map();

obtenerProductos() {
  if (this.cache.has('productos')) {
    return of(this.cache.get('productos'));
  }
  // ... petición y guardar en cache
}
```

### 3. Debounce en Filtros

```typescript
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

this.filtrosForm.valueChanges
  .pipe(debounceTime(300), distinctUntilChanged())
  .subscribe(() => this.aplicarFiltros());
```

### 4. Índices en BD

```sql
CREATE INDEX idx_nombre ON producto(nombre);
CREATE INDEX idx_tipo ON producto(tipo);
CREATE INDEX idx_marca ON producto(marca);
```

---

## 🐛 Solución de Problemas

### Error: "404 Not Found" en API

**Causa:** Rutas de inventario no importadas en `app.js`

**Solución:**

```javascript
import inventarioRoutes from './routes/inventarioRoutes.js';
app.use('/api', inventarioRoutes);
```

---

### Error: "Cannot connect to MySQL"

**Causa:** MySQL no está corriendo o credenciales incorrectas

**Solución:**

1. Abrir XAMPP y iniciar MySQL
2. Verificar credenciales en `api/.env`
3. Verificar que la base de datos `pixtronic` existe

---

### Error: "Link 'Inventario' no aparece"

**Causa:** Usuario no tiene permisos de administrador

**Solución:**

```sql
UPDATE cliente SET admin = 1 WHERE email = 'tu-email@ejemplo.com';
```

Luego:

1. Cerrar sesión
2. Limpiar localStorage (F12 > Application > Local Storage > Clear)
3. Volver a iniciar sesión

---

## 📞 Contacto y Soporte

- **Autor**: Juan Pablo
- **Institución**: CETI
- **Proyecto**: Pixtronic - Sistema de Gestión de Inventario
- **Semestre**: 8vo

---

## 📄 Licencia

Este proyecto es un trabajo académico para la materia de Programación Web II.

---

**Última actualización:** Noviembre 2025
