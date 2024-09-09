import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { SubmoduloService } from '@services/submodulo.service';

export const routerPermisseGuard: CanActivateFn = (route, state) => {
  const {url} = state;

  const authService = inject(AuthService);
  const router = inject(Router);
  const menu = inject(SubmoduloService);


  if(authService.isModuloPermisse()){
    menu.menuActual(url);
    return true;
  }
  router.navigate(['mod']);
  return false;
};


