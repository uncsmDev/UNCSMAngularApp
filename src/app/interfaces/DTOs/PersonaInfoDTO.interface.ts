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
    img: SafeUrl;
    imgDto?: FileDto;
}