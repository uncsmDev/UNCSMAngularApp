import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Pregunta } from '@interfaces/pregunta';
import { appsettings } from 'app/Settings/appsettings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreguntaService {
  private http = inject(HttpClient);
  private ruta:string = appsettings.apiApp + 'Pregunta';

  constructor() { }

  get(id:number): Observable<Pregunta[]>{
    return this.http.get<Pregunta[]>(`${this.ruta}/${id}`)
  }

  post(pregunta: Pregunta): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(pregunta);
    return this.http.post(this.ruta, body, {headers});
  }

  update(pregunta: Pregunta):Observable<any> {
    debugger
    const headers = {'content-type': 'application/json'}
    const body = JSON.stringify(pregunta);
    return this.http.put(`${this.ruta}/${pregunta.id}`, body, {headers});
  }
}
