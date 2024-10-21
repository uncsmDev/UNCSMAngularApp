export interface DatosPersonalesInput {
    id: number;
    dni?: string;
    nombres?: string;
    apellidos?: string;
    ins: string;
    img?: string | ArrayBuffer;
}