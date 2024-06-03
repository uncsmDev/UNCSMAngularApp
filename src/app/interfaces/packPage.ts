export interface PackPage<TEntityModel> {
    listModel: TEntityModel[];
    paginacion: Paginacion;
  }

  export interface Paginacion {
    paginaInicio: number;
    paginaTotal: number;
    contadorTotal: number;
    paginasAnteriores: boolean;
    paginasPosteriores: boolean;
  }