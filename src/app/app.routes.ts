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
                    pathMatch: 'full',
                  },
                {
                    
                    path: 'escala',
                    title: 'Escalas',
                    loadComponent: () => import('./pages/sed/escala/escala.component'),
                    canActivate: [routerPermisseGuard]
                },
                {
                    
                    path: 'periodo',
                    title: 'Periodos',
                    loadComponent: () => import('./pages/sed/periodo/periodo.component'),
                    canActivate: [routerPermisseGuard]
                },
                {
                    path: 'home',
                    title: 'Home',
                    loadComponent: () => import('./pages/sed/home/home.component'),
                    canActivate: [routerPermisseGuard]
                },
                {
                    path: 'tipos-evaluaciones',
                    title: 'Tipos de Evaluaciones',
                    loadComponent: () => import('./pages/sed/instrumento/TipoEvaluacion/TipoEvaluacion.component'),
                    canActivate: [routerPermisseGuard]
                },
                {
                    path: 'tipo-trabajador/:id',
                    title: 'Instrumentos',
                    loadComponent: () => import('./pages/sed/instrumento/tipo-trabajador/TipoTrabajador.component'),
                    canActivate: [routerPermisseGuard]
                },
                {
                    path: 'instrumentos/:TipoEvaluacionId/:TipoTrabajadorId',
                    title: 'Instrumentos',
                    loadComponent: () => import('./pages/sed/instrumento/instrumento.component'),
                    canActivate: [routerPermisseGuard]
                }
                ,{
                    path: 'pc/:id',
                    title: 'Preguntas Cerradas',
                    loadComponent: () => import('./pages/sed/instrumento/preguntas-cerradas/preguntas.component'),
                    canActivate: [routerPermisseGuard]
                },
                {
                    path: 'pa/:id',
                    title: 'Preguntas Abiertas',
                    loadComponent: () => import('./pages/sed/instrumento/preguntas-abiertas/preguntas-abiertas.component'),
                    canActivate: [routerPermisseGuard]
                },
                {
                    path: 'asignacion',
                    title: 'Asignación para la Evaluación',
                    loadComponent: () => import('./pages/sed/asignacion-evaluacio/asignacion-evaluacio.component'),
                    canActivate: [routerPermisseGuard]
                },

                {
                    path: 'asignacion/:id',
                    title: 'Asignación para la Evaluación',
                    loadComponent: () => import('./pages/sed/asignacion-evaluacio/asignacion/asignacion.component'),
                    canActivate: [routerPermisseGuard]
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
