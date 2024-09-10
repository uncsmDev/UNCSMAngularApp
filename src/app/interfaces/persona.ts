import { Sexo } from "./sexo";

export interface Persona {
    id: number;
    dni: string;
    nombres: string;
    apellidos: string;
    fechaNace: Date;
    sexoId:number;
    sexo: Sexo;
    img:string;
}