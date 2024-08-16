// Generated by https://quicktype.io

import { Instrumento } from "./instrumento";

export interface Periodo {
    id:                   number;
    nombre:               string;
    fechaInicio:          string;
    fechaFin:             string;
}


// Generated by https://quicktype.io

export interface PeriodoInstrumento {
    id:                   number;
    nombre:               string;
    fechaInicio:          string;
    fechaFin:             string;
    periodoxInstrumentos: PeriodoxInstrumento[];
    eliminado:            boolean;
    visible:              boolean;
}

export interface PeriodoxInstrumento {
    periodoId:         number;
    instrumentoId:     number;
    eliminado?:         boolean;
    visible?:           boolean;
    instrumento?:       Instrumento;
}

// Generated by https://quicktype.io

export interface PeriodoAddInstrumento {
    id:                   number;
    nombre:               string;
    fechaInicio:          string;
    fechaFin:             string;
    periodoxInstrumentos: PeriodoxInstrumento[];
    eliminado:            boolean;
    visible:              boolean;
}
