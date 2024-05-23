import { CanActivateFn } from '@angular/router';

export const routerPermisseGuard: CanActivateFn = (route, state) => {
  return true;
};
