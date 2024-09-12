import { Cargo } from "./cargo";
import { Dependencia } from "./dependencia";

export interface EvaluacionCargo {
    id: number;
    cargoEvaluadorId: number;
    cargoId: number; // Corresponde a "CargoEvaluadoId" en C#
    dependenciaId: number;
    cantidadEvaluados: number;
    cargo?: Cargo; // Propiedad opcional
    dependencia?: Dependencia; // Propiedad opcional
  }
  