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

export interface UsuarioView{
  id: string;
  entidadId:number;
  email:string;
  phoneNumber: string;
}

export interface InsertUsuario {
  personaId: number,
  email: string,
  password: string,
  confirmPassword:string,
  telefono:string,
}

export interface UserDto{
  Email: string,
  Password: string,
  ConfirmPassword:string
}