import { CargoXDependencia } from "./cargoxdependencia";
import { TipoContrato } from "./tipo_contrato";

export interface Contrato
{
    id: number,
    fechaInicio: string,
    fechaFin: string,
    activo: boolean,
    finalizado: boolean,
    cancelado: boolean,
    cargoXDependenciaId: number,
    trabajadorId: number,
    tipoContratoId: number,
    cargoXDependencia: CargoXDependencia,
    tipoContrato:TipoContrato,
}