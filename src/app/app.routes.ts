import { Routes } from '@angular/router';

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
        loadComponent: () => import('./mod/mod.component')
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
        redirectTo: '/mod'
    }
];
