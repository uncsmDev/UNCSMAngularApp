import { SubModuloViewerTable } from "./submodulo";

export interface TrabajadorInput {

    id: number;
    dni: string;
    nombres: string;
    apellidos: string;
    fechaNace: string;
    sexoId: string;
  
    municipioId: string;
    estadoCivilId: string;
    direccion: string;
    telefono1: string;
    telefono2?: string;
    correoPersonal?: string;
  
    codigo: string;
    fechaIngreso: string;
  
    fechaInicio: string;
    fechaFin?: string;
  
    dependenciaId: string;
    cargoId: string;
    tipoContratoId: string;
  
    email: string;
    password: string;
    confirmPassword: string;
    telefono: string;

    SubModulos: SubModuloViewerTable[];
  }