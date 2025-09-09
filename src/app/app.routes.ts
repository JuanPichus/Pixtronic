import { Routes } from '@angular/router';
import { CatalogoComponent } from './catalogo/catalogo';

export const routes: Routes = [
  { path: 'catalogo', component: CatalogoComponent },
  { path: '', redirectTo: '/catalogo', pathMatch: 'full' },
];
