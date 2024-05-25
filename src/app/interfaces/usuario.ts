export interface Usuario {
}
 

export interface UsuarioViewModel {
    id: string;
    nombres: string | null;
    apellidos: string | null;
    email: string;
    cargo: string | null;
}

interface DetalleUsuarioViewModel extends UsuarioViewModel {
    codigo: number;
    sexo: string;
    dni: string;
    tipoEntidad: string;
    dependencia: string;
}

interface InsertUsuarioViewModel extends UsuarioViewModel {
    entidadId: number;
    codigo: number;
    sexoId: number;
    dni: string;
    tipoEntidadId: number;
    dependenciaId: number;
    cargoId: number;
}