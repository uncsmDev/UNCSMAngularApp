import { Persona } from './persona';
import { Cargo } from './cargo';
import { TipoEntidad } from './tipoEntidad';
import { Dependencia } from './dependencia';
import { Archivo } from './archivo';
import { InsertUsuario } from './usuario';
import { SubModuloViewerTable, SubModuloXUser } from './submodulo';

export interface Entidad {
    id: number;
    codigo: number;
    fechaIngreso: Date;
    persona?: Persona;
    cargo?: Cargo;
    tipoEntidad?: TipoEntidad[];
    dependencia?: Dependencia;
}

export interface EntidadDto {
    id: number;
    codigo: number;
    dni:string;
    nombres:string;
    apellidos: string;
    sexoId:number;
    fechaIngreso: Date;
    cargoId?: number;
    tipoEntidadId?:  TipoEntidad[];
    dependenciaId?: number;
}


export interface EntidadFullDto {
    //datos personales
    codigo: number;
    dni: string;
    nombres: string;
    apellidos: string;
    sexoId:number;
    fechaIngreso: Date;
    //Imagen de Perfil
    
    carpeta: string;
    subCarpeta: string;
   // fileA: File|null;
    //Cuenta de Usuario
    email: string,
    password: string,
    confirmPassword:string,
  
    telefono:string,
    // Institucional
    cargoId: number;
    tipoEntidad: TipoEntidad[];
    dependenciaId: number;
    //Permisos
    SubModulos: SubModuloViewerTable[];
}