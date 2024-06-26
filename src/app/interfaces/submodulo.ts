// Generated by https://quicktype.io

import { Modulo } from "./modulo";

export interface SubModulo {
    id:                number;
    titulo:            string;
    descripcion:       string;
    path:              string;
    icon:              string;
    loadComponent:     string;
    moduloId:          number;
    visible?:           boolean;
    modulo: Modulo;
}

export interface SubModuloViewer {
    id:                number;
    titulo:            string;
}

