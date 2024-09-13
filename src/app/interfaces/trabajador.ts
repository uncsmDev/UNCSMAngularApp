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
