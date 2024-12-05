export interface Contrato {
    id: number;
    fechaInicio: Date;
    fechaFin: Date | null;
    finalizado: boolean;
    cargoXDependenciaId: number;
    trabajadorId: number;
    tipoContratoId: number;
}