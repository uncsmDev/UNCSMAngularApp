import { DatosGenerales } from "./datos.generales";
import { Persona } from "./persona";
import { Sexo } from "./sexo";
import { SubModuloViewerTable } from "./submodulo";
import { Trabajador } from "./trabajador";
import { Contrato } from "./contrato";
import { Dependencia } from "./dependencia";
import { Cargo } from "./cargo";

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

  export interface TrabajadorDto
  {
    id: number;
    dirImg: string;

    trabajador: Trabajador;
    persona: Persona;
    sexo: Sexo;
    datosGenerales: DatosGenerales;

    usuarioId:string;
    usuario: string;
    visible: boolean;
    eliminado: boolean;
    subModulos: SubModuloViewerTable[];

    contrato: Contrato;
    cargo: Cargo;
    dependencia:Dependencia;
  }