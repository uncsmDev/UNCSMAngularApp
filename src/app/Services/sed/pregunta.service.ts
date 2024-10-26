import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { PreguntasCerradas } from '@interfaces/pregunta_cerradas';
import { Result } from '@interfaces/Result.interface';
import { TipoEntidad, TipoTrabajador } from '@interfaces/tipoEntidad';
import { appsettings } from 'app/Settings/appsettings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreguntaService {
  private http = inject(HttpClient);
  private ruta:string = appsettings.apiApp + 'PreguntaCerrada';
  
  private rutaInstrumento:string = appsettings.apiApp + 'TipoTrabajador';

  constructor() { }

  get(id:number): Observable<PreguntasCerradas[]>{
    return this.http.get<PreguntasCerradas[]>(`${this.ruta}/${id}`)
  }

  post(pregunta: PreguntasCerradas): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(pregunta);
    return this.http.post(this.ruta, body, {headers});
  }

  update(pregunta: PreguntasCerradas):Observable<any> {
    const headers = {'content-type': 'application/json'}
    const body = JSON.stringify(pregunta);
    return this.http.put(`${this.ruta}/${pregunta.id}`, body, {headers});
  }

  delete(pregunta: PreguntasCerradas): Observable<Result<PreguntasCerradas>>{
    return this.http.delete<Result<PreguntasCerradas>>(`${this.ruta}/${pregunta.id}`);
  }
  getInstrumento(id:number){
    return this.http.get<Result<TipoTrabajador>>(`${this.rutaInstrumento}/GetOneXInstrumento/${id}`)
  }
}
