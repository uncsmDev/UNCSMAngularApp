import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EstadoCivil } from '@interfaces/estado.civil';
import { PackPage } from '@interfaces/packPage';
import { appsettings } from 'app/Settings/appsettings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadoCivilService {

  private http = inject(HttpClient);
  private apiUrl:string = appsettings.apiApp + "EstadoCivil";

  constructor() { }

  getList():Observable<PackPage<EstadoCivil>>
  {
    var list= this.http.get<PackPage<EstadoCivil>>(this.apiUrl+'/GetList');
    return list;
  }
}
