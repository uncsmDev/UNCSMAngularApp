import { Injectable, inject } from '@angular/core';
import { appsettings } from '../../Settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sexo } from '../../interfaces/sexo';

@Injectable({
  providedIn: 'root'
})
export class SexoService {

  private http = inject(HttpClient);

  private apiUrl:string = appsettings.apiApp + "Sexo";

  constructor() { }

  getList(): Observable<Sexo[]> {
    var list= this.http.get<Sexo[]>(this.apiUrl+'/GetList');
  
    return list;
  }

}
