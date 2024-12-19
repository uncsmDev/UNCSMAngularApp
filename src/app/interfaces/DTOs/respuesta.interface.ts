export interface RespuestaDTO {
    id: number;
    respuesta: string;
}

export interface RespuestaAbiertaDTO {
    evaluacionTrabajadorId: number; // ID de la evaluación del trabajador
    preguntaCerradaId: number;      // ID de la pregunta cerrada asociada
    preguntaAbiertaNombre: string;  // Nombre de la pregunta abierta
    respuestaAbiertaId: number;     // ID de la respuesta abierta
    respuesta: string;              // Contenido de la respuesta abierta
  }