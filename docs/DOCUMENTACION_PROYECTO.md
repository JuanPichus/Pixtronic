# Pixtronic - Tienda de Componentes Electrónicos

## 📋 Índice

1. [Descripción General](#descripción-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Tecnologías Utilizadas](#tecnologías-utilizadas)
4. [Base de Datos](#base-de-datos)
5. [Backend - API REST](#backend---api-rest)
6. [Frontend - Angular](#frontend---angular)
7. [Funcionalidades Principales](#funcionalidades-principales)
8. [Flujo de Usuario](#flujo-de-usuario)
9. [Características Técnicas Destacadas](#características-técnicas-destacadas)
10. [Instalación y Configuración](#instalación-y-configuración)

---

## 📖 Descripción General

**Pixtronic** es una aplicación web de comercio electrónico especializada en la venta de componentes electrónicos de PC (procesadores, tarjetas gráficas y memorias RAM). El sistema permite a los usuarios navegar por un catálogo de productos, agregar artículos a un carrito de compras y realizar pagos mediante PayPal, mientras que los administradores tienen acceso a un sistema completo de gestión de inventario.

### Objetivos del Proyecto

- Proporcionar una plataforma moderna de e-commerce para componentes de PC
- Gestión integral del inventario con operaciones CRUD
- Autenticación y autorización de usuarios
- Procesamiento de pagos en línea mediante PayPal
- Generación de recibos en formato XML
- Interfaz responsive y amigable

---

## 🏗️ Arquitectura del Sistema

El proyecto sigue una arquitectura **Cliente-Servidor** con separación clara entre frontend y backend:

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE (Frontend)                        │
│                   Angular 20.2.0                             │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Catálogo  │  │  Carrito   │  │ Inventario │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
                           │
                      HTTP/JSON
                           │
┌─────────────────────────────────────────────────────────────┐
│                   SERVIDOR (Backend)                         │
│                   Express.js + Node.js                       │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   Rutas    │  │Controladores│  │  Config    │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
                           │
                      MySQL2/Promise
                           │
┌─────────────────────────────────────────────────────────────┐
│                  BASE DE DATOS (MySQL)                       │
│           Tablas: usuario, producto, pedido,                 │
│                   productopedido                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 💻 Tecnologías Utilizadas

### Frontend

- **Angular 20.2.0**: Framework principal para la SPA (Single Page Application)
- **TypeScript 5.9.2**: Lenguaje de programación tipado
- **RxJS 7.8**: Programación reactiva
- **ngx-paypal 11.0.0**: Integración con PayPal
- **Angular Standalone Components**: Arquitectura moderna sin módulos
- **Angular Signals**: Gestión de estado reactivo

### Backend

- **Node.js 24.10.0**: Entorno de ejecución
- **Express.js 5.1.0**: Framework web
- **MySQL2 3.15.2**: Conector de base de datos con soporte de promesas
- **CORS 2.8.5**: Manejo de peticiones cross-origin
- **dotenv 17.2.3**: Gestión de variables de entorno
- **crypto (nativo)**: Hashing de contraseñas con SHA-1
- **nodemailer**: Envío de correos electrónicos

### Base de Datos

- **MySQL/MariaDB 10.4.32**: Sistema de gestión de base de datos relacional
- **phpMyAdmin**: Administración visual de la base de datos

---

## 🗄️ Base de Datos

La base de datos `pixtronic` está compuesta por 4 tablas principales con relaciones bien definidas:

### Diagrama Entidad-Relación

```
┌──────────────┐         ┌──────────────────┐         ┌──────────────┐
│   usuario    │         │  productopedido  │         │   producto   │
├──────────────┤         ├──────────────────┤         ├──────────────┤
│ id_user (PK) │         │ id_productoPedido│         │id_producto(PK)│
│ username     │         │ cant_prod        │         │ nombre       │
│ lastname     │         │ fk_producto (FK) │◄────────┤ marca        │
│ password     │         │ fk_pedido (FK)   │         │ tipo         │
│password_plain│         └──────────────────┘         │ precio       │
│ email        │                  ▲                   │ vigente      │
│ birth_date   │                  │                   │ cantidad     │
│ admin        │                  │                   └──────────────┘
│local_direction│                 │
└──────────────┘                  │
       │                          │
       │                          │
       │         ┌──────────────┐ │
       │         │    pedido    │ │
       │         ├──────────────┤ │
       └────────►│id_pedido (PK)├─┘
                 │ fk_user (FK) │
                 └──────────────┘
```

### Tabla `usuario`

Almacena la información de los usuarios del sistema.

**Campos:**

- `id_user` (INT, PK, AUTO_INCREMENT): Identificador único
- `username` (TINYTEXT): Nombre del usuario
- `lastname` (TINYTEXT): Apellido del usuario
- `password` (TINYTEXT): Contraseña hasheada con SHA-1
- `password_plain` (VARCHAR(255)): Contraseña en texto plano para recuperación
- `email` (TINYTEXT): Correo electrónico único
- `birth_date` (DATE): Fecha de nacimiento
- `admin` (TINYINT(1)): Flag de administrador (0=usuario, 1=admin)
- `local_direction` (TINYTEXT): Dirección en formato JSON

### Tabla `producto`

Catálogo de productos disponibles.

**Campos:**

- `id_producto` (INT, PK, AUTO_INCREMENT): Identificador único
- `nombre` (TINYTEXT): Nombre del producto
- `marca` (TINYTEXT): Marca (Intel, AMD, NVIDIA, Corsair, etc.)
- `tipo` (TINYTEXT): Tipo de producto (CPU, GPU, RAM)
- `precio` (MEDIUMINT): Precio en pesos mexicanos
- `vigente` (TINYINT(1)): Producto activo/inactivo (soft delete)
- `cantidad` (TINYINT): Cantidad en stock

**Datos de Ejemplo:**

- CPUs: Intel Core i5-13600K, AMD Ryzen 5 7600X, etc.
- GPUs: NVIDIA RTX 4060 Ti, AMD RX 7600, Intel Arc A750
- RAMs: Corsair Vengeance, G.Skill Trident, Kingston HyperX

### Tabla `pedido`

Registra las órdenes de compra.

**Campos:**

- `id_pedido` (BIGINT, PK, AUTO_INCREMENT): Identificador único del pedido
- `fk_user` (INT, FK): Referencia al usuario que realizó el pedido

### Tabla `productopedido`

Tabla intermedia para la relación muchos a muchos entre pedidos y productos.

**Campos:**

- `id_productoPedido` (BIGINT, PK, AUTO_INCREMENT): Identificador único
- `cant_prod` (TINYINT): Cantidad del producto en el pedido
- `fk_producto` (INT, FK): Referencia al producto
- `fk_pedido` (BIGINT, FK): Referencia al pedido

---

## 🔧 Backend - API REST

El backend está construido con **Express.js** siguiendo el patrón **MVC** (Model-View-Controller), aunque sin una capa de modelos explícita, trabajando directamente con consultas SQL.

### Estructura de Archivos

```
api/
├── app.js                    # Punto de entrada, configuración de Express
├── config/
│   └── db.js                 # Configuración de conexión a MySQL
├── controllers/
│   ├── catalogoController.js    # Lógica del catálogo público
│   ├── inventarioController.js  # CRUD completo de productos
│   ├── pedidoController.js      # Gestión de pedidos
│   └── registroController.js    # Autenticación y recuperación
└── routes/
    ├── catalogoRoutes.js
    ├── inventarioRoutes.js
    ├── pedidoRoutes.js
    └── registroRoutes.js
```

### Endpoints Principales

#### **Autenticación y Registro** (`/api`)

| Método | Endpoint                  | Descripción                  |
| ------ | ------------------------- | ---------------------------- |
| POST   | `/api/registro`           | Registrar nuevo usuario      |
| POST   | `/api/login`              | Iniciar sesión               |
| POST   | `/api/recuperar-password` | Enviar contraseña por correo |

#### **Catálogo Público** (`/api/catalogo`)

| Método | Endpoint                      | Descripción                 |
| ------ | ----------------------------- | --------------------------- |
| GET    | `/api/catalogo/productos`     | Obtener productos vigentes  |
| GET    | `/api/catalogo/productos/:id` | Obtener producto específico |

#### **Inventario (Admin)** (`/api/inventario`)

| Método | Endpoint                        | Descripción                |
| ------ | ------------------------------- | -------------------------- |
| GET    | `/api/inventario/productos`     | Listar todos (con filtros) |
| POST   | `/api/inventario/productos`     | Agregar nuevo producto     |
| PUT    | `/api/inventario/productos/:id` | Modificar producto         |
| DELETE | `/api/inventario/productos`     | Eliminar/reducir cantidad  |

#### **Pedidos** (`/api/pedidos`)

| Método | Endpoint               | Descripción                |
| ------ | ---------------------- | -------------------------- |
| POST   | `/api/pedidos`         | Crear pedido con productos |
| GET    | `/api/pedidos/:userId` | Obtener pedidos de usuario |

### Controladores Destacados

#### `registroController.js`

- **Registro de usuarios**: Valida email, hashea contraseña (SHA-1), almacena dirección en JSON
- **Login**: Compara credenciales hasheadas
- **Recuperación de contraseña**: Envía correo con contraseña en texto plano usando Nodemailer con plantilla HTML personalizada

#### `inventarioController.js`

- **CRUD completo** con validaciones robustas
- **Filtros múltiples**: nombre, marca, tipo, id
- **Soft delete**: Marca productos como no vigentes en lugar de eliminarlos
- **Gestión de stock**: Disminuye cantidad y marca como no vigente cuando llega a 0

#### `catalogoController.js`

- **Solo productos vigentes**: Filtrado automático por `vigente = 1`
- **Optimizado para clientes**: Sin exponer información administrativa

### Configuración de Base de Datos

```javascript
// api/config/db.js
mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
```

Utiliza **pool de conexiones** para mejor rendimiento y manejo de concurrencia.

---

## 🎨 Frontend - Angular

Aplicación **Single Page Application** (SPA) construida con Angular 20 utilizando **Standalone Components** (sin NgModules).

### Estructura de Archivos

```
src/app/
├── app.ts                      # Componente raíz
├── app.routes.ts               # Configuración de rutas
├── app.config.ts               # Configuración de la aplicación
├── carrito/                    # Módulo de carrito de compras
│   ├── carrito.ts
│   ├── carrito.html
│   └── carrito.css
├── catalogo/                   # Catálogo de productos
│   ├── catalogo.ts
│   ├── catalogo.html
│   └── catalogo.css
├── inventario/                 # Panel de administración
│   ├── inventario.component.ts
│   ├── inventario.component.html
│   └── inventario.component.css
├── login/                      # Inicio de sesión
├── registro/                   # Registro de usuarios
├── recuperar-password/         # Recuperación de contraseña
├── modelos/
│   └── producto.ts             # Interface del modelo Producto
└── servicios/
    ├── auth.service.ts         # Autenticación
    ├── carrito.service.ts      # Gestión del carrito
    ├── inventario.service.ts   # API de inventario
    ├── pedido.service.ts       # API de pedidos
    └── productos.ts            # API de catálogo
```

### Enrutamiento

```typescript
// app.routes.ts
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: ... },
  { path: 'registro', loadComponent: ... },
  { path: 'recuperar-password', loadComponent: ... },
  { path: 'catalogo', loadComponent: ... },
  { path: 'carrito', loadComponent: ... },
  { path: 'inventario', loadComponent: ... },
  { path: '**', redirectTo: 'login' }
];
```

Utiliza **Lazy Loading** para cargar componentes bajo demanda.

### Servicios Principales

#### `AuthService`

- Gestión de autenticación con **BehaviorSubject** para estado reactivo
- Almacenamiento en **localStorage** del usuario actual
- Verificación SSR-safe con `isPlatformBrowser`
- Métodos: `login()`, `logout()`, `isAuthenticated()`, `isAdmin()`

```typescript
interface Usuario {
  id: number;
  username: string;
  email: string;
  admin: boolean;
}
```

#### `CarritoService`

- Gestión del carrito usando **Angular Signals**
- Estado reactivo y computed values
- Métodos: `agregar()`, `quitar()`, `vaciar()`, `total()`, `exportarXML()`
- Generación de recibos XML con subtotal, IVA (16%) y total

```typescript
private productosSignal = signal<Producto[]>([]);
productos = this.productosSignal.asReadonly();
```

#### `ProductosService` & `InventarioService`

- Comunicación HTTP con la API
- Tipado estricto con interfaces TypeScript
- Manejo de errores con Observable

### Componentes Destacados

#### `CatalogoComponent`

- Carga productos vigentes desde la API
- Permite agregar productos al carrito
- Feedback visual con mensajes temporales
- Optimización con `trackBy` en `*ngFor`

#### `CarritoComponent`

- **Integración con PayPal** mediante `ngx-paypal`
- Cálculo automático de subtotal, IVA y total con computed signals
- Al confirmar pago:
  1. Crea snapshot del carrito
  2. Registra pedido en la base de datos
  3. Disminuye stock de productos
  4. Genera recibo XML
  5. Vacía el carrito

```typescript
onClientAuthorization: (data) => {
  const itemsSnapshot = [...this.carrito()];
  // Registrar pedido
  this.pedidoService.crearPedidoConItems(payload).subscribe({
    next: (resp) => {
      if (resp?.ok) {
        this.generarReciboXML();
        this.vaciar();
      }
    },
  });
};
```

#### `InventarioComponent` (Solo Admin)

- **CRUD completo** de productos
- **Filtros dinámicos**: nombre, marca, tipo, id
- **Validaciones exhaustivas**:
  - RNF 2.1: Todos los campos obligatorios
  - RNF 2.2: Cantidad debe ser entero > 0
  - Precio debe ser > 0
- **Modo edición inline**: Click en producto para editar
- **Soft delete**: Eliminar por nombre con reducción de cantidad opcional

---

## ⚙️ Funcionalidades Principales

### 1. Sistema de Autenticación

**Registro de Usuarios**

- Validación de formato de email con regex
- Validación de contraseñas coincidentes (mínimo 6 caracteres)
- Hashing de contraseñas con SHA-1
- Almacenamiento de dirección en formato JSON
- Almacenamiento dual de contraseña (hasheada + texto plano para recuperación)

**Inicio de Sesión**

- Comparación de credenciales hasheadas
- Generación de objeto de usuario en memoria
- Persistencia en localStorage
- Redirección al catálogo tras login exitoso

**Recuperación de Contraseña**

- Envío de correo con Nodemailer
- Plantilla HTML profesional con estilos inline
- Incluye contraseña en texto plano
- Advertencia de seguridad en el correo

### 2. Catálogo de Productos

- Visualización de productos vigentes
- Información: nombre, marca, tipo, precio, cantidad disponible
- Filtrado visual por categorías (CPU, GPU, RAM)
- Agregar al carrito con un clic
- Feedback visual de productos agregados

### 3. Carrito de Compras

**Gestión de Productos**

- Agregar productos desde el catálogo
- Eliminar productos individuales
- Vaciar carrito completo
- Visualización de subtotal, IVA (16%) y total

**Procesamiento de Pago**

- **Integración con PayPal Sandbox**
- Configuración dinámica con productos del carrito
- Desglose de montos (subtotal + IVA)
- Conversión a formato PayPal (ITransactionItem)

**Generación de Recibos**

- Formato XML estándar
- Incluye: fecha, productos, subtotal, IVA, total
- Descarga automática con timestamp
- Nombre: `recibo-pixtronic-[timestamp].xml`

### 4. Gestión de Inventario (Administradores)

**Operaciones CRUD**

- **Create**: Agregar nuevos productos con validaciones
- **Read**: Listar con filtros múltiples
- **Update**: Edición inline de productos existentes
- **Delete**: Soft delete con gestión de stock

**Filtros Avanzados**

- Por nombre (búsqueda parcial con LIKE)
- Por marca (búsqueda parcial)
- Por tipo (exacto: CPU, GPU, RAM)
- Por ID (exacto)
- Combinación de múltiples filtros

**Validaciones RNF**

- RNF 2.1: Todos los campos obligatorios
- RNF 2.2: Cantidad debe ser número entero positivo
- Precio debe ser número positivo
- Alertas descriptivas para cada error

### 5. Sistema de Pedidos

**Creación de Pedidos**

- Generación automática tras pago confirmado
- Registro del pedido principal (tabla `pedido`)
- Creación de líneas de pedido (tabla `productopedido`)
- Disminución automática de stock
- Transacción atómica (todo o nada)

**Consulta de Pedidos**

- Historial por usuario
- JOIN con productos para información completa
- Visualización de cantidades y precios

---

## 🔄 Flujo de Usuario

### Usuario Regular (Cliente)

```
1. Inicio de Sesión / Registro
   ↓
2. Navegar Catálogo
   ↓
3. Agregar Productos al Carrito
   ↓
4. Revisar Carrito
   ↓
5. Procesar Pago con PayPal
   ↓
6. Confirmación y Descarga de Recibo XML
   ↓
7. Registro de Pedido en BD
```

### Usuario Administrador

```
1. Inicio de Sesión (admin = 1)
   ↓
2. Acceder a Inventario
   ↓
3. Operaciones:
   - Ver todos los productos (vigentes y no vigentes)
   - Agregar nuevos productos
   - Modificar productos existentes
   - Eliminar/reducir stock de productos
   - Aplicar filtros de búsqueda
   ↓
4. Guardar Cambios en BD
```

---

## 🌟 Características Técnicas Destacadas

### 1. Arquitectura Moderna

- **Standalone Components** en Angular (sin NgModules)
- **Signals** para gestión de estado reactivo
- **Lazy Loading** de componentes
- **Server-Side Rendering (SSR)** preparado

### 2. Seguridad

- **Hashing de contraseñas** con SHA-1
- **CORS** configurado en el backend
- **Validación de entrada** en cliente y servidor
- **Soft delete** para mantener integridad referencial

### 3. Experiencia de Usuario

- **Interfaz responsive** con CSS moderno
- **Feedback visual** inmediato (mensajes de éxito/error)
- **Navegación condicional** (navbar oculta en login/registro)
- **Validaciones en tiempo real**

### 4. Optimizaciones

- **Pool de conexiones** MySQL para mejor rendimiento
- **TrackBy** en listas para optimizar renderizado
- **Computed values** para cálculos reactivos automáticos
- **Lazy loading** de rutas

### 5. Integración con Servicios Externos

- **PayPal SDK** para pagos en línea
- **Nodemailer** para envío de correos
- **Plantillas HTML** profesionales en emails

### 6. Manejo de Errores

- **Try-catch** en todos los controladores
- **Status codes HTTP** apropiados (200, 201, 400, 401, 404, 500)
- **Mensajes descriptivos** de error
- **Logging** en consola para debugging

---

## 🚀 Instalación y Configuración

### Requisitos Previos

- Node.js 24.10.0 o superior
- MySQL 5.7 o MariaDB 10.4 o superior
- npm o yarn

### Backend

1. **Navegar a la carpeta API**

```bash
cd api
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**
   Crear archivo `.env` en `/api`:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=pixtronic

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASSWORD=tu_app_password
```

4. **Importar base de datos**

```bash
mysql -u root -p < pixtronic.sql
```

5. **Iniciar servidor**

```bash
node app.js
```

Servidor corriendo en `http://localhost:3000`

### Frontend

1. **Navegar a la raíz del proyecto**

```bash
cd Pixtronic
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar PayPal**
   Editar `src/app/carrito/carrito.ts`:

```typescript
clientId: 'TU_PAYPAL_CLIENT_ID';
```

4. **Iniciar aplicación Angular**

```bash
npm start
```

Aplicación corriendo en `http://localhost:4200`

### Configuración de PayPal Sandbox

1. Crear cuenta en [PayPal Developer](https://developer.paypal.com/)
2. Crear aplicación en "My Apps & Credentials"
3. Obtener Client ID del Sandbox
4. Configurar en `carrito.ts`

---

## 📊 Modelo de Datos Completo

### Relaciones

- `usuario` → `pedido` (1:N)
- `pedido` → `productopedido` (1:N)
- `producto` → `productopedido` (1:N)

### Indices

- Primary Keys en todas las tablas
- Foreign Keys con constraints
- AUTO_INCREMENT en IDs

### Consideraciones de Diseño

- **Soft Delete**: Campo `vigente` en productos
- **Denormalización parcial**: `precio` en productos (no en productopedido)
- **JSON en campos**: `local_direction` para flexibilidad
- **Dual password storage**: `password` (hash) + `password_plain` (recuperación)

---

## 🎯 Requerimientos No Funcionales Implementados

### RNF 2.1 - Validación de Campos Obligatorios

✅ Todos los formularios validan campos requeridos
✅ Mensajes descriptivos de error
✅ Validación en cliente y servidor

### RNF 2.2 - Validación de Cantidad

✅ Cantidad debe ser número entero
✅ Cantidad debe ser mayor a 0
✅ Validación con `Number.isInteger()`

### Otros RNF

- **Rendimiento**: Pool de conexiones, lazy loading
- **Usabilidad**: Feedback visual, navegación intuitiva
- **Mantenibilidad**: Código modular, separación de responsabilidades
- **Escalabilidad**: Arquitectura cliente-servidor independiente

---

## 📝 Conclusiones

**Pixtronic** es una aplicación web completa de comercio electrónico que demuestra:

✅ **Arquitectura Full-Stack** moderna con Angular y Node.js  
✅ **Integración de servicios externos** (PayPal, Nodemailer)  
✅ **Gestión completa de inventario** con validaciones robustas  
✅ **Autenticación y autorización** de usuarios  
✅ **Base de datos relacional** bien estructurada  
✅ **Generación de documentos** (recibos XML)  
✅ **Interfaz responsiva** y user-friendly  
✅ **Buenas prácticas** de desarrollo (separación de capas, manejo de errores, validaciones)

El proyecto está listo para ser desplegado en producción con mínimos ajustes (cambiar a PayPal Live, configurar HTTPS, optimizar hashing de contraseñas a bcrypt).

---

## 👥 Información del Proyecto

**Institución**: Centro de Enseñanza Técnica Industrial (CETI)  
**Materia**: Programación Web II  
**Semestre**: 8  
**Fecha**: Noviembre 2025

---

_Documentación generada para el proyecto Pixtronic - Todos los derechos reservados_
