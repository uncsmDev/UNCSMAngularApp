import { Persona } from "./persona";

export interface Trabajador
{
    id: number,
    codigo: string,
    fechaIngreso: Date,
    personaId:number,
    persona:Persona,
    contratos: number
}

export type tipoModal =  'add' | 'edit'
export type postDelete =  'instrumento' | 'dimension'
