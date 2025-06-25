import { Routes } from '@angular/router';
import { PruebasComponent } from './components/pruebas/pruebas.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { FavoritosComponent } from './components/favoritos/favoritos.component';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-aut.guard';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { NuevaPasswordComponent } from './components/auth/nueva-password/nueva-password.component';
import { VerifyCodeComponent } from './components/auth/verify-code/verify-code.component';

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
    canActivate: [authGuard]
  },
  {
    path: 'favoritos',
    component: FavoritosComponent,
    canActivate: [authGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [noAuthGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [noAuthGuard]
  },
  {
    path: 'recuperar-password',
    component: ForgotPasswordComponent,
    canActivate: [noAuthGuard]
  },
  {
    path: 'verificar-codigo',
    component: VerifyCodeComponent,
    canActivate: [noAuthGuard]
  },
  {
    path: 'nueva-password',
    component: NuevaPasswordComponent,
    canActivate: [noAuthGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
