import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const isAuthTrueGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  debugger
  if(sessionStorage.getItem("isAuth")!== null && sessionStorage.getItem("isAuth"))
    {
      
      router.navigate(['mod']);
      return false;  
    }
    return true;
};
