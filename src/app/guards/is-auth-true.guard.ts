import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

export const isAuthTrueGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  console.log(sessionStorage.getItem("isAuth"))
  if(authService.isAuth())
    {
      router.navigate(['mod']);
      return false;  
    }
    return true;
};
