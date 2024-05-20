import { Routes } from '@angular/router';

export const routes: Routes = [{
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component'),
    children: [
        {
            path: 'mod',
            title: 'Modulos',
            loadComponent: () => import('./dashboard/mod/mod.component')
        },
        {
            path: 'sed',
            title: 'Sistema de Evaluación al Desempeño',
            loadComponent: () => import('./dashboard/sed/sed.component'),
        }
    ]
    },
    {
        path: 'login',
        loadComponent: ()=> import('./auth/login/login.component')
    },
    {
        path: '',
        redirectTo: '/dashboard/mod',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/dashboard/mod'
    }
];
