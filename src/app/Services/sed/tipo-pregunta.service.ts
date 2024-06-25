import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { TipoPregunta } from '@interfaces/tipo_pregunta';
import { appsettings } from 'app/Settings/appsettings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoPreguntaService {

  private ruta:string = appsettings.apiApp + 'TipoPregunta';
  private http = inject(HttpClient);
  constructor() { }

  get(): Observable<TipoPregunta[]>
  {
    return this.http.get<TipoPregunta[]>(this.ruta);
  }
}
