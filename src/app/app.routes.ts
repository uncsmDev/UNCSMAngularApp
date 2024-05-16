import { Routes } from '@angular/router';

export const routes: Routes = [{
    path: 'modulos',
    loadComponent: () => import('./modulos/modulos.component'),
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
