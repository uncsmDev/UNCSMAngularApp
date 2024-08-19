import { Sexo } from "./sexo";

export interface Persona {
    id: number;
    dni: string;
    nombres: string;
    apellidos: string;
    sexoId:number;
    sexo: Sexo;
    img:string;
}