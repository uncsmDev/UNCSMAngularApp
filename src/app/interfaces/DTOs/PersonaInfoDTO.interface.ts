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
    contratoActivo: boolean;
    dependenciaId: number;
    dependenciaNombre: string;
    cargoId: number;
    cargoNombre: string;
    tipoTrabajadorId: number;
    tipoTrabajadorNombre: string;
  }

  export interface PersonaDirectivoInfoProcedureDTO {
    personaId: number;
    personaNombres: string;
    personaApellidos: string;
    personaDNI: string;
    personaFechaNace?: Date; // Nullable
    personaSexoId: number;
    personaImg: string;
    trabajadorId: number;
    trabajadorCodigo: string;
    trabajadorFechaIngreso: Date;
    contratoId: number;
    contratoFechaInicio: Date;
    contratoFechaFin?: Date; // Nullable
    contratoActivo: boolean;
    dependenciaId: number;
    dependenciaNombre: string;
    cargoId: number;
    cargoNombre: string;
    tipoTrabajadorId: number;
    tipoTrabajadorNombre: string;
    tipoContratoId: number;
    tipoContratoNombre: string;
    evaluacionId: number;
    evaluacionTerminada: boolean;
    evaluacionCualitativaTerminada: boolean;
    evaluacionCuantitativaTerminada: boolean;
    evaluadoId: number;
    evaluadorId: number;
    evaluadonContratoId: number;
    imgFile?: FileDto; // Nullable
}
