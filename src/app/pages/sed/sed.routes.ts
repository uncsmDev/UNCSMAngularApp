import { Routes } from "@angular/router";
import { routerPermisseGuard } from "app/guards/router-permisse.guard";

export default [
    {
        path: '',
        redirectTo: '/sed/home',
        pathMatch: 'full',
      },
    {
        path: 'home',
        title: 'Home',
        loadComponent: () => import('./home/home.component'),
        data: { breadcrumb: 'Home' },
        canActivate: [routerPermisseGuard]
    },
      {
        path: 'evaluacion/:evaluacionId',
        title: 'Aplicación de la Evaluación',
        loadComponent: () => import('.//home/AplicacionEvaluacion/AplicacionEvaluacion.component'),
        data: { breadcrumb: 'Escalas' },
        canActivate: [routerPermisseGuard]
      },
      {
        path: 'personal',
        title: 'Personal',
        loadComponent: () => import('./home/personal/personal.component'),
        data: { breadcrumb: 'Escalas' },
        canActivate: [routerPermisseGuard]
      },
    {
        
        path: 'escala',
        title: 'Escalas',
        loadComponent: () => import('./escala/escala.component'),
        data: { breadcrumb: 'Escalas' },
        canActivate: [routerPermisseGuard]
    },
    {
        
        path: 'periodo',
        title: 'Periodos',
        loadComponent: () => import('./periodo/periodo.component'),
        data: { breadcrumb: 'Periodos' },
        canActivate: [routerPermisseGuard]
    },
    {
        path: 'tipos-evaluaciones',
        title: 'Tipos de Evaluaciones',
        loadComponent: () => import('./instrumento/TipoEvaluacion/TipoEvaluacion.component'),
        data: { breadcrumb: 'Tipos de Evaluaciones' },
        canActivate: [routerPermisseGuard]
    },
    {
        path: 'tipo-trabajador/:id',
        title: 'Tipos de trabajadores',
        loadComponent: () => import('./instrumento/tipo-trabajador/TipoTrabajador.component'),
        data: { breadcrumb: 'Tipos de trabajadores' },
        canActivate: [routerPermisseGuard],
    },
    {
        path: 'instrumentos/:TipoEvaluacionId/:TipoTrabajadorId',
        title: 'Instrumentos',
        loadComponent: () => import('./instrumento/instrumento.component'),
        data: { breadcrumb: 'Instrumentos' },
        canActivate: [routerPermisseGuard]
    }
    ,{
        path: 'pc/:id',
        title: 'Preguntas Cerradas',
        loadComponent: () => import('./instrumento/preguntas-cerradas/preguntas.component'),
        data: { breadcrumb: 'Preguntas Cerradas' },
        canActivate: [routerPermisseGuard]
    },
    {
        path: 'pa/:id',
        title: 'Preguntas Abiertas',
        loadComponent: () => import('./instrumento/preguntas-abiertas/preguntas-abiertas.component'),
        data: { breadcrumb: 'Preguntas Abiertas' },
        canActivate: [routerPermisseGuard]
    },
    {
        path: 'asignacion/:id/:dependenciaId',
        title: 'Asignación para la Evaluación',
        loadComponent: () => import('./asignacion-evaluacio/asignacion/asignacion.component'),
        data: { breadcrumb: 'Asignación para la Evaluación' },
        canActivate: [routerPermisseGuard]
    },
    {
        
        path: 'resultados',
        title: 'Resultados',
        loadComponent: () => import('./home/resultados/resultados.component'),
        data: { breadcrumb: 'Resultados' },
        canActivate: [routerPermisseGuard]
    },
    {
        
        path: 'resultados/resultado-instrumento/:evaluacionId',
        title: 'Instrumento',
        loadComponent: () => import('./home/resultados/resultados-instrumento/resultados-instrumento.component'),
        data: { breadcrumb: 'Resultados' },
        canActivate: [routerPermisseGuard]
    },
] as Routes;