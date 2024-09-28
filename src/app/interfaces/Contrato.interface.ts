export interface Contrato {
    id: number;
    fechaInicio: Date;
    fechaFin: Date | null;
    activo: boolean;
    finalizado: boolean;
    cancelado: boolean;
    cargoXDependenciaId: number;
    trabajadorId: number;
    tipoContratoId: number;
}