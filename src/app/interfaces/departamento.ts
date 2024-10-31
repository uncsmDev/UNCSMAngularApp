import { Pais } from './pais';
export interface Departamento{
    id: number,
    nombre: string,
    paisId: number
    pais:Pais
  }