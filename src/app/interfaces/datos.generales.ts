import { EstadoCivil } from "./estado.civil";

export interface DatosGenerales
{
    id: number;
    municipioId: number;
    personaId: number;
    estadoCivilId: number;
    direccion: string;
    telefono1: string;
    telefono2?: string;
    correoPersonal: string;
    estadoCivil:EstadoCivil;
}