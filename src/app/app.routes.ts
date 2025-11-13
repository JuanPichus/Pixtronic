//app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'registro', 
    loadComponent: () => import('./registro/registro.component').then(m => m.RegistroComponent)
  },
  { 
    path: 'recuperar-password', 
    loadComponent: () => import('./recuperar-password/recuperar-password.component').then(m => m.RecuperarPasswordComponent)
  },
  { 
    path: 'catalogo', 
    loadComponent: () => import('./catalogo/catalogo').then(m => m.CatalogoComponent)
  },
  { 
    path: 'carrito', 
    loadComponent: () => import('./carrito/carrito').then(m => m.CarritoComponent)
  },
  { 
    path: '**', 
    redirectTo: 'login' 
  }
];