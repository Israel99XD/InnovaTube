import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs';


export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  return authService.isLoggedIn$.pipe(
      take(1),
      map(isAuth => {
        if (isAuth) {
          return  true;
        } else {
          return router.parseUrl('/login');
        }
      })
    );
};