//app.routes.ts
import { Routes } from '@angular/router';
import { Catalogo } from "./catalogo/catalogo";
import { CarritoComponent } from "./carrito/carrito";
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';

export const routes: Routes = [
    // Redirige la ruta raíz ('/') al login
    {path: '', redirectTo: "login", pathMatch: 'full'}, //Se cambio para que la ruta default es el login
    {path: 'login', component: LoginComponent }, //La ruta para el login
    {path: 'registro', component: RegistroComponent }, //ruta del regsitro
    {path: 'catalogo', component: Catalogo},
    
    {path: 'carrito', component: CarritoComponent},
    { path: '**', redirectTo: '/login' } // Si no existe la ruta solicitada de manda al login
];