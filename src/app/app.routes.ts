import { Routes } from '@angular/router';

export const routes: Routes = [{
    path: 'modulos',
    loadComponent: () => import('./modulos/modulos.component'),
    children: [
        {
            path: 'sed',
            title: 'Sistema de Evaluación al Desempeño',
            loadComponent: () => import('./modulos/sed/sed.component'),
        }
    ]
    },
    {
        path: 'login',
        loadComponent: ()=> import('./auth/login/login.component')
    },
    {
        path: '',
        redirectTo: '/modulos',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/modulos'
    }
];
