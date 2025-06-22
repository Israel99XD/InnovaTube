import { Routes } from '@angular/router';
import { PruebasComponent } from './components/pruebas/pruebas.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'pruebas',
        pathMatch: 'full'
    },
    {
        path: 'pruebas',
        component: PruebasComponent
    }
];
