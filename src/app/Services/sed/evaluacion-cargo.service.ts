import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Cargo, CargoAsignacion } from '@interfaces/cargo';
import { Dependencia } from '@interfaces/dependencia';
import { EvaluacionCargo } from '@interfaces/evaluacion_cargo';
import { Result } from '@interfaces/Result.interface';
import { appsettings } from 'app/Settings/appsettings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EvaluacionCargoService {
  http = inject(HttpClient);
  ruta = appsettings.apiApp + 'EvaluacionCargo';
  
  getEvaluacionCargo(id: number): Observable<Result<EvaluacionCargo[]>>{
    return this.http.get<Result<EvaluacionCargo[]>>(`${this.ruta}/GetById/${id}`);
  }

  getEvaluacionCargoAsignados(id: number): Observable<Result<EvaluacionCargo[]>>{
    return this.http.get<Result<EvaluacionCargo[]>>(`${this.ruta}/GetEvaluacionCargoAsignados/${id}`);
  }

  getDependencia(id: number): Observable<Result<Dependencia>>{
    return this.http.get<Result<Dependencia>>(`${this.ruta}/GetDependencia/${id}`);
  }

}
