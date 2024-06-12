import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { appsettings } from '../Settings/appsettings';
import { Observable } from 'rxjs';
import { TipoEntidad } from '../interfaces/tipoEntidad';
import { TipoEvaluacion } from '../interfaces/tipo_evaluacion';
import { Instrumento } from '../interfaces/instrumento';

@Injectable({
  providedIn: 'root'
})
export class InstrumentoService {

  private http = inject(HttpClient);
  private ruta:string = appsettings.apiApp + 'Instrumento';
  private rutaTipoEntidad:string = appsettings.apiApp + 'TipoEntidad/';
  private rutaTipoEvaluacion:string = appsettings.apiApp + 'TipoEvaluacion';

  constructor() { }

  getTipoEntidad(): Observable<TipoEntidad[]>
  {
    return this.http.get<TipoEntidad[]>(this.rutaTipoEntidad + 'GetList');
  }

  getTipoEvaluacion(): Observable<TipoEvaluacion[]>
  {
    return this.http.get<TipoEvaluacion[]>(this.rutaTipoEvaluacion)
  }

  post(instrumento: Instrumento): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(instrumento);
    return this.http.post(this.ruta, body, {headers});
  }

  get(): Observable<Instrumento[]>{
    return this.http.get<Instrumento[]>(this.ruta)
  }

  delete(instrumento: Instrumento | null): Observable<any>{
    const id = instrumento!.id;
    return this.http.delete(`${this.ruta}/${id}`);
  }
}
