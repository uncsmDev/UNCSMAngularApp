import { CargoXDependencia } from './cargoxdependencia';
import { EvaluacionCargo } from './evaluacion-cargo';
import { TipoTrabajador } from './tipoEntidad';
export interface Cargo
{
    id: number,
    nombre: string,
    descripcion: string,
    cargoXDependencias?: CargoXDependencia[],
    tipoTrabajador?: TipoTrabajador
}

export interface CargoAsignacion
{
    id: number,
    nombre: string,
    descripcion: string,
    cantidad?: number
    evaluacionCargoId?: number;
    _CargoXDependencias?: CargoXDependencia[]
}

// Generated by https://quicktype.io

export interface CargosDependenciaGet {
    id?:                 number;
    dependenciaID:       number;
    nombreDependencia:   string;
    cargoID:             number;
    cargoNombre:         string;
    dependenciaSuperior: number;
    evaluacionCargo?:    EvaluacionCargo;
    cantidadEvaluado?:  number;
    nombreTipoTrabajador:string;
    tipoTrabajadorId:number;
}


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

// Generated by https://quicktype.io

export interface CargoDTO {
    dependenciaId:     number;
    nombreDependencia: string;
    cargoId:           number;
    cargoNombre:       string;
    cantidad:          number;
}

export interface CargoPaginationDTO {
    listModel:  CargoDTO[];
    paginacion: Paginacion;
}
