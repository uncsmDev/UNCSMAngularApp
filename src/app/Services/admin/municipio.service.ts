import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Municipio } from '@interfaces/municipio';
import { PackPage } from '@interfaces/packPage';
import { Result } from '@interfaces/Result.interface';
import { appsettings } from 'app/Settings/appsettings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MunicipioService {

  private http = inject(HttpClient);
  private apiUrl:string = appsettings.apiApp + "Municipio";

  constructor() { }

  getList(pag:number):Observable<PackPage<Municipio>>
  {
    var list= this.http.get<PackPage<Municipio>>(this.apiUrl+'/GetList?Pagina='+pag);
    return list;
  }

  getListByDepartamentoId(pag:number,paisId:number):Observable<PackPage<Municipio>>
  {
    var list= this.http.get<PackPage<Municipio>>(this.apiUrl+'/GetListByDepartamentoId?Pagina='+pag+'&departamentoId='+paisId);
    return list;
  }

  getById(id:number):Observable<Result<Municipio>>
  {
    var element= this.http.get<Result<Municipio>>(this.apiUrl+'/GetById?id='+id);
    return element;
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
