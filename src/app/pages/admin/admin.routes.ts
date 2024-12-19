import { Routes } from "@angular/router";
import { routerPermisseGuard } from "app/guards/router-permisse.guard";

export default [
    {
        path: '',
        redirectTo: '/admin/home',
        pathMatch: 'full'
      },
    {
        path:'usuarios', 
        title: 'Usuarios',
        loadComponent:()=>import('../../auth/usuarios/usuarios.component')
    },
 
    {
        path:'dependencias', 
        title: 'Unidades',
        loadComponent:()=>import('./dependencias/dependencias.component')
    },
   
    {
        path: 'home',
        title: 'Home',
        loadComponent: () => import('./home/home.component'),
    },
    {
        path: 'modulo',
        title: 'Catalogo Modulo',
        loadComponent: () => import('./modulo/modulo.component'),
    },
    
    {
        path: 'submodulo',
        title: 'Catalogo SubModulos',
        loadComponent: () => import('./submodulo/submodulo.component'),
    },
    {
        path: 'trabajador',
        title: 'Trabajadores',
        loadComponent: () => import('./trabajador/trabajador.component'),
    },
    {
        path: 'trabajador/nuevo-trabajador',
        title: 'Nuevo Trabajador',
        loadComponent: () => import('./trabajador/trabajador-input/trabajador-input.component'),
    },
    {
        path:'trabajador/usuario/:id', 
        title: 'Usuario',
        loadComponent:()=>import('../../auth/usuarios/usuario/usuario.component')
    },
    {
        path: 'perfilEntidad/:id',
        title: 'Perfil',
        loadComponent: () => import('./perfilEntidad/perfil.entidad.component'),
    },
    {
        path: 'trabajador/perfil/:id',
        title: 'Perfil Trabajador',
        loadComponent: () => import('./trabajador/trabajador-perfil/trabajador-perfil.component'),
    },
    {
        path: 'contratos',
        title: 'Contratos',
        loadComponent: () => import('./contratos/contratos.component'),
    },
    {
        path: 'contratos/contrato/:id',
        title: 'Contrato Perfil',
        loadComponent: () => import('./contratos/contrato/contrato.component'),
    }
    
] as Routes;