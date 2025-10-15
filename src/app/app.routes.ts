import { Routes } from '@angular/router';
import { Catalogo } from "./catalogo/catalogo";
import { CarritoComponent } from "./carrito/carrito";
export const routes: Routes = [
    {path: '', redirectTo: "catalogo", pathMatch: 'full'},
    {path: 'catalogo', component: Catalogo},
    {path: 'carrito', component: CarritoComponent}
];