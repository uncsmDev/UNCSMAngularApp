export interface Dependencia {
    id: number;
    nombre: string;
    dependenciaId: number;
    objDependencia?: Dependencia;
}