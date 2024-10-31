import { SafeHtml } from '@angular/platform-browser';
export interface DatosPersonalesInput {
    id: number;
    dni?: string;
    nombres?: string;
    apellidos?: string;
    ins: string;
    img?: string | ArrayBuffer;
   
}

export interface InformacionPersonal
{
    id: number;
    estadoCivilId: number;
    sexoId: number;
    municipioId: number;
    direccion: string;
    telefono1: string;
    telefono2?: string;
    correoPersonal: string;
    paisId: number;
    departamentoId: number;
}
