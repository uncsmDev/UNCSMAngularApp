export interface ContratoDetalle {
    id: number; // IdContrato
    fechaInicio: Date;
    fechaFin?: Date | null; // Puede ser nulo
    activo: boolean;
    eliminado: boolean;
    visible: boolean;
    cancelado: boolean;
    finalizado: boolean;
    cargo: string;
    dependencia: string;
    idTipoContrato: number;
    tipoContrato: string;
    idTipoTrabajador: number;
    tipoTrabajador: string;
  }