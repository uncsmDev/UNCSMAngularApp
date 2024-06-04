import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { authChildGuard } from './guards/auth-child.guard';
import { isAuthTrueGuard } from './guards/is-auth-true.guard';

export const routes: Routes = [{
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component'),
    canActivate: [authGuard],
    canActivateChild: [authChildGuard],
    },
    {
    path: 'sed',
    title: 'Sistema de Evaluación al Desempeño',
    loadComponent: () => import('./pages/sed/sed.component'),
    canActivate: [authGuard],
    canActivateChild: [authChildGuard],
            children: [
                {
                    
                    path: 'escala',
                    title: 'Escalas',
                    loadComponent: () => import('./pages/sed/escala/escala.component'),
                },
                {
                    path:'usuarios', 
                    loadComponent:()=>import('./auth/usuarios/usuarios.component')
                },
                {
                    path: 'home',
                    title: 'Home',
                    loadComponent: () => import('./pages/sed/home/home.component'),
                }
            ]
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
