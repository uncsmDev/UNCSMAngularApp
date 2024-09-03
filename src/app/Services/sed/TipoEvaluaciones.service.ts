import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Result } from '@interfaces/Result.interface';
import { TipoEvaluacion } from '@interfaces/tipo_evaluacion';
import { appsettings } from 'app/Settings/appsettings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoEvaluacionesService {
  http = inject(HttpClient);
  ruta = appsettings.apiApp + 'TipoEvaluacion'
  
  constructor() { }

  get(): Observable<Result<TipoEvaluacion[]>>
  {
    return this.http.get<Result<TipoEvaluacion[]>>(this.ruta);
  }
}
