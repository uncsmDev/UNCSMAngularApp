import { Sexo } from "./sexo";

export interface Persona {
    id: number;
    dNI: string;
    nombres: string;
    apellidos: string;
    sexo: Sexo;
}