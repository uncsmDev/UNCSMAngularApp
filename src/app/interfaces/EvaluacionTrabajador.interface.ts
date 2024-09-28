export interface EvaluacionTrabajador {
    id: number;
    fechaInicioEvaluacion?: Date; // Nullable
    fechaFinEvaluacion?: Date; // Nullable
    evaluacionTerminada: boolean;
    revisionEvaluacion: boolean;
    evaluadoId: number;
    evaluadorId: number;

    categoriaDesempenoId?: number; // Nullable
    periodoId?: number; // Nullable

    periodo?: Periodo; // Nullable
    categoriaDesempenos?: CategoriaDesempeno; // Nullable
    respuestaCerrada?: RespuestaCerrada[]; // Nullable, array of RespuestaCerrada
    respuestaAbierta?: RespuestaAbierta[]; // Nullable, array of RespuestaAbierta
}

export interface Periodo {
    // Define los campos de la interfaz 'Periodo' según tu modelo en C#
}

export interface CategoriaDesempeno {
    // Define los campos de la interfaz 'CategoriaDesempeno' según tu modelo en C#
}

export interface RespuestaCerrada {
    // Define los campos de la interfaz 'RespuestaCerrada' según tu modelo en C#
}

export interface RespuestaAbierta {
    // Define los campos de la interfaz 'RespuestaAbierta' según tu modelo en C#
}
