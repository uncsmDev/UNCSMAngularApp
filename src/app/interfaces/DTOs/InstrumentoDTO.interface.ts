export interface InstrumentoDTO {
    // Propiedades de Instrumento
    Id: number;
    Nombre?: string;
    TipoTrabajadorId: number;
    TipoEvaluacionId: number;

    // Lista de Dimensiones
    dimensiones: DimensionDTO[];
}

export interface DimensionDTO {
    // Propiedades de Dimension
    id: number;
    nombre: string;
    nextStep?: boolean;
    // Lista de Preguntas Cerradas
    preguntasCerradas: PreguntaCerradaDTO[];
}

export interface PreguntaCerradaDTO {
    // Propiedades de PreguntaCerrada
    id: number;
    nombre: string;

    // Propiedades de RespuestaCerrada integradas dentro de PreguntaCerrada
    respuestaCerradaId: number;
    EvaluacionTrabajadorId: number;
    escalaId?: number | null;
}


export interface InstrumentoAbiertoDTO {
    id: number;
    nombre?: string;
    tipoTrabajadorId: number;
    tipoEvaluacionId: number;
    preguntasAbiertas: PreguntaAbiertaDTO[];
}

export interface PreguntaAbiertaDTO {
    id: number;
    nombre: string;
    respuestaAbiertaId: number;
    evaluacionTrabajadorId: number;
    respuesta: string;
}
