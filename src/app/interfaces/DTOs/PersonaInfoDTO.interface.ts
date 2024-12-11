import { SafeUrl } from "@angular/platform-browser";
import { Cargo } from "@interfaces/cargo";
import { CargoXDependencia } from "@interfaces/cargoxdependencia";
import { Contrato } from "@interfaces/Contrato.interface";
import { Dependencia } from "@interfaces/dependencia";
import { EvaluacionTrabajador } from "@interfaces/EvaluacionTrabajador.interface";
import { Persona } from "@interfaces/persona";
import { TipoContrato } from "@interfaces/tipo_contrato";
import { TipoTrabajador } from "@interfaces/tipoEntidad";
import { Trabajador } from "@interfaces/trabajador";
import { FileDto } from "./FileDto";

export interface PersonaInfoDTO {
    persona: Persona;
    trabajador: Trabajador;
    contrato: Contrato;
    cargoXDependencia: CargoXDependencia;
    dependencia: Dependencia;
    cargo: Cargo;
    tipoTrabajador: TipoTrabajador;
    tipoContrato: TipoContrato;
    evaluacionTrabajador: EvaluacionTrabajador;
    imgFile?: FileDto;
}

export interface PersonaDTO {
    personaId: number;
    personaNombres: string;
    personaApellidos: string;
    personaDNI: string;
    personaFechaNace: string | null;
    personaSexoId: number;
    personaImg: string;
    trabajadorId: number;
    trabajadorCodigo: string;
    trabajadorFechaIngreso: string;
    contratoId: number;
    contratoFechaInicio: string;
    contratoFechaFin: string;
    contratoFinalizado: boolean;
    dependenciaId: number;
    dependenciaNombre: string;
    cargoId: number;
    cargoNombre: string;
    tipoTrabajadorId: number;
    tipoTrabajadorNombre: string;
  }
  
  export interface PersonalPorDependenciaDTO {
    nombres: string; // Nombre de la persona
    apellidos: string; // Apellido de la persona
    img: string; // Imagen o URL de la imagen de la persona
    evaluacionTrabajadorId: number; // ID de la evaluación del trabajador
    cargoNombre: string; // Nombre del cargo del trabajador
    fechaInicio: Date; // Fecha de inicio del contrato
    fechaFin?: Date; // Fecha de fin del contrato (opcional)
    evaluacionCualitativaTerminada?: boolean; // Indicador de evaluación cualitativa terminada (opcional)
    evaluacionCuantitativaTerminada?: boolean; // Indicador de evaluación cuantitativa terminada (opcional)
    evaluacionTerminada?: boolean; // Indicador de evaluación completada (opcional)
    imgFile?: FileDto; // Archivo asociado a la imagen (opcional)
  }
  


export interface IEvaluadoDataProcedureDTO {
  personaId: number;
  personaNombres: string;
  personaApellidos: string;
  personaDNI: string;
  personaFechaNace?: Date; // Puede ser null, por eso se usa el operador "?"
  personaSexoId: number;
  personaImg: string;
  trabajadorId: number;
  trabajadorCodigo: string;
  trabajadorFechaIngreso: Date;
  contratoId: number;
  contratoFechaInicio: Date;
  contratoFechaFin?: Date; // Puede ser null
  contratoFinalizado: boolean;
  dependenciaId: number;
  dependenciaNombre: string;
  cargoId: number;
  cargoNombre: string;
  tipoTrabajadorId: number;
  tipoTrabajadorNombre: string;
  evaluacionId: number;
  fechaInicioEvaluacion?: Date; // Puede ser null
  fechaFinEvaluacion?: Date; // Puede ser null
  evaluacionTerminada?: boolean; // Puede ser null
  evaluacionCualitativaTerminada?: boolean; // Puede ser null
  evaluacionCuantitativaTerminada?: boolean; // Puede ser null
  revisionEvaluacion?: boolean; // Puede ser null
  evaluadoId: number;
  evaluadorId: number;
  periodoId?: number; // Puede ser null
}

export interface TrabajadorEvaluacionDTO {
  trabajadorID: number; // ID del trabajador
  evaluadorId: number; // ID del evaluador
  dependenciaId: number; // ID de la dependencia
  evaluacionId: number; // ID de la evaluación
  personaCargoDTO?: PersonaCargoDTO; // Detalles de la persona y cargo
}

export interface PersonaCargoDTO {
  nombres: string; // Nombre de la persona
  apellidos: string; // Apellido de la persona
  dependencia: string; // Nombre de la dependencia
  cargo: string; // Nombre del cargo
}

