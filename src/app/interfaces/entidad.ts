import { Persona } from './persona';
import { Cargo } from './cargo';
import { TipoEntidad } from './tipoEntidad';
import { Dependencia } from './dependencia';

export interface Entidad {
    id: number;
    codigo: number;
    fechaIngreso: Date;
    persona?: Persona;
    cargo?: Cargo;
    tipoEntidad?: TipoEntidad;
    dependencia?: Dependencia;
}