import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Cargo, CargoAsignacion, CargosDependenciaGet } from '@interfaces/cargo';
import { Dependencia } from '@interfaces/dependencia';
import { EvaluacionCargo } from '@interfaces/evaluacion-cargo';
import { Result } from '@interfaces/Result.interface';
import { appsettings } from 'app/Settings/appsettings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EvaluacionCargoService {
  http = inject(HttpClient);
  ruta = appsettings.apiApp + 'EvaluacionCargo';

  getEvaluacionCargo(id: number){
    return this.http.get<Result<CargosDependenciaGet[]>>(`${this.ruta}/GetById/${id}`);
  }

  getEvaluacionCargoAsignados(id: number){
    return this.http.get<Result<CargosDependenciaGet[]>>(`${this.ruta}/GetEvaluacionCargoAsignados/${id}`);
  }

  getDependencia(id: number): Observable<Result<Dependencia>>{
    return this.http.get<Result<Dependencia>>(`${this.ruta}/GetDependencia/${id}`);
  }

  post(cargoDependencia: EvaluacionCargo){
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(cargoDependencia);
    return this.http.post<Result<EvaluacionCargo>>(`${this.ruta}`, body, {headers});
  }


  updateCantidad(id: number, cantidad: number){
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(cantidad);
    return this.http.put<Result<EvaluacionCargo>>(`${this.ruta}/PutCantidad/${id}`, body, {headers});
  }
  DeleteXDependencia(CargoEvaluadorId:number) {
    return this.http.delete<Result<EvaluacionCargo>>(this.ruta+'/DeleteXDependencia/'+CargoEvaluadorId)
  }

  delete(CargoEvaluadorId:number) {
    return this.http.delete<Result<EvaluacionCargo>>(this.ruta+'/'+CargoEvaluadorId)
  }
}
