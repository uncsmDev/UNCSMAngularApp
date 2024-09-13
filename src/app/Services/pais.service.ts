import { Injectable, inject } from '@angular/core';
import { appsettings } from '../Settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pais } from '../interfaces/pais';
import { PackPage } from '@interfaces/packPage';

@Injectable({
  providedIn: 'root'
})
export class PaisService {

  private http = inject(HttpClient);
  private apiUrl:string = appsettings.apiApp + "Pais";

  constructor() { }

  /*getList(): Observable<Pais[]> {
    return this.http.get<Pais[]>(this.apiUrl);
  }*/

  getList():Observable<PackPage<Pais>>
  {
    var list= this.http.get<PackPage<Pais>>(this.apiUrl+'/GetList');
    return list;
  }

}
