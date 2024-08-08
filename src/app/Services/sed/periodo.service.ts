import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Periodo } from '@interfaces/periodo';
import { Result } from '@interfaces/Result.interface';
import { appsettings } from 'app/Settings/appsettings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeriodoService {

  http = inject(HttpClient)
  ruta = appsettings.apiApp + 'periodo'

  constructor() { }

  get(): Observable<Result<Periodo[]>>{
    return this.http.get<Result<Periodo[]>>(`${this.ruta}`)
  }

  post(periodo: Periodo): Observable<Result<Periodo>>{
    const headers = { 'content-type': 'application/json'}  
    const jsonPeriodo = JSON.stringify(periodo);
    return this.http.post<Result<Periodo>>(`${this.ruta}`, periodo, {headers})
  }

  put(periodo: Periodo): Observable<Result<Periodo>>{
    const headers = { 'content-type': 'application/json'}  
    const jsonPeriodo = JSON.stringify(periodo);
    return this.http.put<Result<Periodo>>(`${this.ruta}/${periodo.id}`, jsonPeriodo, {headers})
  }

  delete(periodo: Periodo): Observable<Result<Periodo>>
  {
    return this.http.delete<Result<Periodo>>(`${this.ruta}/${periodo.id}`)
  }

}
