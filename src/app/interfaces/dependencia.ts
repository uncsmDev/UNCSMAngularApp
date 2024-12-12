export interface Dependencia {
    id: number;
    nombre: string;
    dependenciaId: number;
    objDependencia?: Dependencia;
}

// Generated by https://quicktype.io

export interface DependenciaPagination {
    listModel:  DependenciaList[];
    paginacion: Paginacion;
}

export interface ListModel {
    id:                number;
    nombre:            string;
    dependenciaId:     number | null;
    dependencias:      null;
}

export interface Paginacion {
    paginaInicio:       number;
    paginaTotal:        number;
    cantidadRegistro:   number;
    contadorTotal:      number;
    paginasAnteriores:  boolean;
    paginasPosteriores: boolean;
}

// Generated by https://quicktype.io

export interface DependenciaList {
    id:                number;
    nombre:            string;
    dependenciaId?:     number;
    dependencias?:      DependenciaList[];
}


export interface TreeDependencia {
    id: number;
    nombre: string;
    dependenciaId?: number;
    dependencias: TreeDependencia[];
  }