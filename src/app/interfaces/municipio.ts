import { Departamento } from "./departamento";

export interface Municipio{
    id: number,
    nombre: string,
    departamentoId: number,
    departamento:Departamento
  }