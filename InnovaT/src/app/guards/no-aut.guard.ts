import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  return authService.isLoggedIn$.pipe(
      take(1),
      map(isAuth => {
        if (!isAuth) {
          return  true;
        } else {
          return router.parseUrl('/Home');
        }
      })
    );
};
