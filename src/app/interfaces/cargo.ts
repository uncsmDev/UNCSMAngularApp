export interface Cargo
{
    id: number,
    nombre: string,
    descripcion: string
}

// Generated by https://quicktype.io

export interface CargoPagination {
    listModel:  CargoList[];
    paginacion: Paginacion;
}

export interface CargoList {
    id:                number;
    nombre:            string;
    descripcion?:       string;
}

export interface Paginacion {
    paginaInicio:       number;
    paginaTotal:        number;
    cantidadRegistro:   number;
    contadorTotal:      number;
    paginasAnteriores:  boolean;
    paginasPosteriores: boolean;
}
