import { Routes } from '@angular/router';
import { PruebasComponent } from './components/pruebas/pruebas.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-aut.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'Home',
        component: HomeComponent,
    },
    {
        path: 'pruebas',
        component: PruebasComponent,
        canActivate:[authGuard]
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate:[noAuthGuard]
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate:[noAuthGuard]
    }
];
