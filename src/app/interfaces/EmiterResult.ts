import { tipoModal } from "./instrumento";

export interface EmiterResult<T>{
    typeModal: tipoModal;
    data: T
  }

export type TipoFormulario = 'instrumento' | 'add-pregunta';