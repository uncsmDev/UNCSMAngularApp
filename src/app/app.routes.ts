import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { authChildGuard } from './guards/auth-child.guard';
import { isAuthTrueGuard } from './guards/is-auth-true.guard';
import { routerPermisseGuard } from './guards/router-permisse.guard';

export const routes: Routes = [
    {
    path: 'sed',
    title: 'Sistema de Evaluación al Desempeño',
    loadComponent: () => import('./pages/sed/sed.component'),
    canActivate: [authGuard, routerPermisseGuard],
    canActivateChild: [authChildGuard],
    loadChildren: () => import('./pages/sed/sed.routes')
    },
    {
        path: 'admin',
        title: 'Administración',
        loadComponent: () => import('./pages/admin/admin.component'),
        canActivate: [authGuard, routerPermisseGuard],
        canActivateChild: [authChildGuard],
        loadChildren: () => import('./pages/admin/admin.routes')
    },
    {
        path: 'mod',
        title: 'Modulos',
        loadComponent: () => import('./pages/mod/mod.component'),
        canActivate: [authGuard]
    },
    {
        path: 'login',
        loadComponent: ()=> import('./auth/login/login.component'),
        canActivate: [isAuthTrueGuard]
    },
    {
        path: '',
        redirectTo: '/mod',
        pathMatch: 'full'
    },
    {
        path: '**',
        loadComponent: ()=> import('./pages/not-found/not-found.component')
    }
];
