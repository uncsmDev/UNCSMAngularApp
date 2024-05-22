import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [{
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component'),
    children: [
        
        {
            path: 'sed',
            title: 'Sistema de Evaluación al Desempeño',
            loadComponent: () => import('./dashboard/pages/sed/sed.component'),
        }
    ]
    },
    {
        path: 'mod',
        title: 'Modulos',
        loadComponent: () => import('./mod/mod.component'),
        canActivate: [authGuard]
    },
    {
        path: 'login',
        loadComponent: ()=> import('./auth/login/login.component')
    },
    {
        path: '',
        redirectTo: '/mod',
        pathMatch: 'full'
    },
    {
        path: '**',
        loadComponent: ()=> import('./not-found/not-found.component')
    }
];
