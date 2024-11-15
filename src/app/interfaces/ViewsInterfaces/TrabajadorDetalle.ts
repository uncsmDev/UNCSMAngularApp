import { ContratoDetalle } from "./ContratoDetalle";

export interface TrabajadorDetalle {
    id: number;
    nombres: string;
    apellidos: string;
    dni?: string | null; 
    img?: string | null; 
    correo?: string | null; 
    codigo?: string | null; 
    sexo?: string | null; 
    contratos: ContratoDetalle[];
  }