export interface Usuario {
}
 

export interface UsuarioViewModel {
    id: string;
    nombres: string | null;
    apellidos: string | null;
    email: string;
    cargo: string | null;
    img?: File;
}

interface DetalleUsuarioViewModel extends UsuarioViewModel {
    codigo: number;
    sexo: string;
    dni: string;
    tipoEntidad: string;
    dependencia: string;
}

export interface InsertUsuario {
  entidadId: number,
  email: string,
  password: string,
  confirmPassword:string,

  telefono:string,
}