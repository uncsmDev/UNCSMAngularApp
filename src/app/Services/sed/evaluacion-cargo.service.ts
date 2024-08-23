import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Cargo } from '@interfaces/cargo';
import { Result } from '@interfaces/Result.interface';
import { appsettings } from 'app/Settings/appsettings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EvaluacionCargoService {
  http = inject(HttpClient);
  ruta = appsettings.apiApp + 'EvaluacionCargo';
  
  getEvaluacionCargo(id: number): Observable<Result<Cargo[]>>{
    return this.http.get<Result<Cargo[]>>(`${this.ruta}/GetById/${id}`);
  }

}
