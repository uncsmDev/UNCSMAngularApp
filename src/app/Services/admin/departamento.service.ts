import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Departamento } from '@interfaces/departamento';
import { PackPage } from '@interfaces/packPage';
import { appsettings } from 'app/Settings/appsettings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {

  private http = inject(HttpClient);
  private apiUrl:string = appsettings.apiApp + "Departamento";

  constructor() { }

  getList(pag:number):Observable<PackPage<Departamento>>
  {
    var list= this.http.get<PackPage<Departamento>>(this.apiUrl+'/GetList?Pagina='+pag);
    return list;
  }

  getListByPaisId(pag:number,paisId:number):Observable<PackPage<Departamento>>
  {
    var list= this.http.get<PackPage<Departamento>>(this.apiUrl+'/GetListByPaisId?Pagina='+pag+'&PaisId='+paisId);
    return list;
  }
}
