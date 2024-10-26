import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Dimension } from '@interfaces/dimension';
import { appsettings } from 'app/Settings/appsettings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DimensionService {
  private http = inject(HttpClient);
  private ruta:string = appsettings.apiApp + 'Dimension';
  constructor() { }

  get(): Observable<Dimension[]>{
    return this.http.get<Dimension[]>(this.ruta);
  }

  getTE(idTE: number){
    return this.http.get<Dimension>(`${this.ruta}/${idTE}`);
  }
}
