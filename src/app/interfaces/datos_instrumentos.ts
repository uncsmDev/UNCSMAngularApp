import { Instrumento } from "./instrumento";
import { TipoEntidad } from "./tipoEntidad";

export interface DatosInstrumentos
{
    tipo: TipoEntidad;
    instrumentos: Instrumento;
}