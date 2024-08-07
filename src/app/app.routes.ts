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
            children: [
                {
                    path: '',
                    redirectTo: 'sed/home',
                    pathMatch: 'full'
                  },
                {
                    
                    path: 'escala',
                    title: 'Escalas',
                    loadComponent: () => import('./pages/sed/escala/escala.component'),
                },
               
                {
                    path: 'home',
                    title: 'Home',
                    loadComponent: () => import('./pages/sed/home/home.component'),
                },
                {
                    path: 'tipo',
                    title: 'Tipo',
                    loadComponent: () => import('./pages/sed/instrumento/tipo/tipo.component'),
                },
                {
                    path: 'instrumentos/:id',
                    title: 'Instrumentos',
                    loadComponent: () => import('./pages/sed/instrumento/instrumento.component'),
                }
                ,{
                    path: 'instrumento/:id',
                    title: 'Instrumento',
                    loadComponent: () => import('./pages/sed/instrumento/preguntas/preguntas.component'),
                }
            ]
    },
    {
        path: 'admin',
        title: 'Administración',
        loadComponent: () => import('./pages/admin/admin.component'),
        canActivate: [authGuard, routerPermisseGuard],
        canActivateChild: [authChildGuard],
        children: [
            {
                path: '',
                redirectTo: 'admin/home',
                pathMatch: 'full'
              },
            {
                path: 'entidad',
                title: 'Entidades',
                loadComponent: () => import('./pages/admin/entidad/entidad.component'),
            },
            {
                path: 'perfilEntidad/:id',
                title: 'Perfil',
                loadComponent: () => import('./pages/admin/perfilEntidad/perfil.entidad.component'),
            },
            {
                path:'inputEntidad',
                title:'Agregar Trabajador',
                loadComponent:()=>import('./pages/admin/entidad/inputentidad/input.entidad.component'),
            },
            {
                path:'usuarios', 
                title: 'Usuarios',
                loadComponent:()=>import('./auth/usuarios/usuarios.component')
            },
            {
                path: 'home',
                title: 'Home',
                loadComponent: () => import('./pages/admin/home/home.component'),
            },
            {
                path: 'modulo',
                title: 'Catalogo Modulo',
                loadComponent: () => import('./pages/admin/modulo/modulo.component'),
            },
            
            {
                path: 'submodulo',
                title: 'Catalogo SubModulos',
                loadComponent: () => import('./pages/admin/submodulo/submodulo.component'),
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
