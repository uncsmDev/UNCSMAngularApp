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
                    redirectTo: '/sed/home',
                    pathMatch: 'full',
                  },
                {
                    path: 'home',
                    title: 'Home',
                    loadComponent: () => import('./pages/sed/home/home.component'),
                    data: { breadcrumb: 'Home' },
                    canActivate: [routerPermisseGuard]
                },
                  {
                    path: 'evaluacion-cuantitativa/:id',
                    title: 'Aplicación de la Evaluación',
                    loadComponent: () => import('./pages/sed/home/AplicacionEvaluacion/AplicacionEvaluacion.component'),
                    data: { breadcrumb: 'Escalas' },
                    canActivate: [routerPermisseGuard]
                  },
                {
                    
                    path: 'escala',
                    title: 'Escalas',
                    loadComponent: () => import('./pages/sed/escala/escala.component'),
                    data: { breadcrumb: 'Escalas' },
                    canActivate: [routerPermisseGuard]
                },
                {
                    
                    path: 'periodo',
                    title: 'Periodos',
                    loadComponent: () => import('./pages/sed/periodo/periodo.component'),
                    data: { breadcrumb: 'Periodos' },
                    canActivate: [routerPermisseGuard]
                },
                {
                    path: 'tipos-evaluaciones',
                    title: 'Tipos de Evaluaciones',
                    loadComponent: () => import('./pages/sed/instrumento/TipoEvaluacion/TipoEvaluacion.component'),
                    data: { breadcrumb: 'Tipos de Evaluaciones' },
                    canActivate: [routerPermisseGuard]
                },
                {
                    path: 'tipo-trabajador/:id',
                    title: 'Tipos de trabajadores',
                    loadComponent: () => import('./pages/sed/instrumento/tipo-trabajador/TipoTrabajador.component'),
                    data: { breadcrumb: 'Tipos de trabajadores' },
                    canActivate: [routerPermisseGuard],
                },
                {
                    path: 'instrumentos/:TipoEvaluacionId/:TipoTrabajadorId',
                    title: 'Instrumentos',
                    loadComponent: () => import('./pages/sed/instrumento/instrumento.component'),
                    data: { breadcrumb: 'Instrumentos' },
                    canActivate: [routerPermisseGuard]
                }
                ,{
                    path: 'pc/:id',
                    title: 'Preguntas Cerradas',
                    loadComponent: () => import('./pages/sed/instrumento/preguntas-cerradas/preguntas.component'),
                    data: { breadcrumb: 'Preguntas Cerradas' },
                    canActivate: [routerPermisseGuard]
                },
                {
                    path: 'pa/:id',
                    title: 'Preguntas Abiertas',
                    loadComponent: () => import('./pages/sed/instrumento/preguntas-abiertas/preguntas-abiertas.component'),
                    data: { breadcrumb: 'Preguntas Abiertas' },
                    canActivate: [routerPermisseGuard]
                },
                {
                    path: 'asignacion',
                    title: 'Asignación para la Evaluación',
                    loadComponent: () => import('./pages/sed/asignacion-evaluacio/asignacion-evaluacio.component'),
                    data: { breadcrumb: 'Asignación para la Evaluación' },
                    canActivate: [routerPermisseGuard]
                },
                {
                    path: 'asignacion/:id/:dependenciaId',
                    title: 'Asignación para la Evaluación',
                    loadComponent: () => import('./pages/sed/asignacion-evaluacio/asignacion/asignacion.component'),
                    data: { breadcrumb: 'Asignación para la Evaluación' },
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
                redirectTo: '/admin/home',
                pathMatch: 'full'
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
            },
            {
                path: 'trabajador',
                title: 'Trabajadores',
                loadComponent: () => import('./pages/admin/trabajador/trabajador.component'),
            }
            ,
            {
                path: 'trabajador/nuevo-trabajador',
                title: 'Nuevo Trabajador',
                loadComponent: () => import('./pages/admin/trabajador/trabajador-input/trabajador-input.component'),
            },
            {
                path: 'perfilEntidad/:id',
                title: 'Perfil',
                loadComponent: () => import('./pages/admin/perfilEntidad/perfil.entidad.component'),
            },
            {
                path: 'trabajador/perfil/:id',
                title: 'Perfil Trabajador',
                loadComponent: () => import('./pages/admin/trabajador/trabajador-perfil/trabajador-perfil.component'),
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
