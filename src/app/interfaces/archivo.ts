export interface Archivo
{
    referenciaId:number;
    carpeta: string;
    subCarpeta: string;
    fileA: File|null;
}

export interface ArchivoResponse {
    id: number;
    nombre: string;
    ubicacion: string;
    subCarpeta?: string | null;
    extension?: string | null;
    peso?: number | null;
    tipoContenido?: string | null;
}