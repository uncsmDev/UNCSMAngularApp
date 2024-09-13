import { Injectable, inject } from '@angular/core';
import { appsettings } from '../../Settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Trabajador} from '../../interfaces/trabajador';
import { Result } from '@interfaces/Result.interface';
import { PackPage, Paginacion } from '@interfaces/packPage';

@Injectable({
  providedIn: 'root'
})
export class TrabajadorService {

  private http = inject(HttpClient);

  private apiUrl:string = appsettings.apiApp + "Trabajador";

  constructor() { }

  getList(pag:number): Observable<PackPage<Trabajador>>
  {
    var list= this.http.get<PackPage<Trabajador>>(this.apiUrl+'/GetList?Pagina='+pag);
    return list;
  }

  getListWithFilter(pag:number,filterText:string): Observable<PackPage<Trabajador>>
  {
    var list= this.http.get<PackPage<Trabajador>>(this.apiUrl+'/GetListWithFilter?Pagina='+pag+"&filterText="+filterText);
    return list;
  }
  
  googleLogin(idToken: string) {
    return this.http.post<{ token: string }>(
      this.apiUrl + 'google-login',
      {
        idToken: idToken,
      }
    );
  }
}
