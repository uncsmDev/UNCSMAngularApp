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


export interface EvaluacionTrabajadorDTO {
    evaluacionTrabajadorId: number;
    dimensionId: number;
    dimensionNombre: string;
    preguntaCerradaId: number;
    preguntaCerradaNombre: string;
    respuestaCerradaId: number;
    escalaId: number;
}

export interface EvaluacionTrabajadorResultadoDTO extends EvaluacionTrabajadorDTO{
    escalaNombre: string;
    escalaValoracion: number;
}