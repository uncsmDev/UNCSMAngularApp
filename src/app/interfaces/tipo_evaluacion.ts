// Generated by https://quicktype.io

import { Instrumento } from "./instrumento";

export interface TipoEvaluacion {
    id:                number;
    nombre:            string;
    siglas:            string;
    descripcion:       string;
    instrumentos?:     Instrumento;
}