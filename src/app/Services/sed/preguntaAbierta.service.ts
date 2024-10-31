import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Instrumento } from '@interfaces/instrumento';
import { PreguntaAbierta } from '@interfaces/pregunta_abierta';
import { PreguntasCerradas } from '@interfaces/pregunta_cerradas';
import { Result } from '@interfaces/Result.interface';
import { TipoEntidad, TipoTrabajador } from '@interfaces/tipoEntidad';
import { appsettings } from 'app/Settings/appsettings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreguntaAbiertaService {
  private http = inject(HttpClient);
  private ruta:string = appsettings.apiApp + 'PreguntaAbierta';
  private rutaInstrumento:string = appsettings.apiApp + 'TipoTrabajador';

  constructor() { }

  get(id:number): Observable<Result<PreguntaAbierta[]>>{
    return this.http.get<Result<PreguntaAbierta[]>>(`${this.ruta}/${id}`)
  }

  getInstrumento(id:number){
    return this.http.get<Result<TipoTrabajador>>(`${this.rutaInstrumento}/GetOneXInstrumento2/${id}`)
  }

  post(pregunta: PreguntaAbierta): Observable<Result<PreguntaAbierta>>{
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(pregunta);
    return this.http.post<Result<PreguntaAbierta>>(this.ruta, body, {headers});
  }

  update(pregunta: PreguntaAbierta):Observable<Result<PreguntaAbierta>> {
    const headers = {'content-type': 'application/json'}
    const body = JSON.stringify(pregunta);
    return this.http.put<Result<PreguntaAbierta>>(`${this.ruta}/${pregunta.id}`, body, {headers});
  }

  delete(pregunta: PreguntaAbierta): Observable<Result<PreguntaAbierta>>{
    return this.http.delete<Result<PreguntaAbierta>>(`${this.ruta}/${pregunta.id}`);
  }
}
