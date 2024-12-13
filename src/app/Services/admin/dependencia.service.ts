import { Result } from './../../interfaces/Result.interface';
import { Injectable, inject } from '@angular/core';
import { appsettings } from '../../Settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dependencia, DependenciaPagination, DepOut, TreeDependencia } from '../../interfaces/dependencia';


@Injectable({
  providedIn: 'root'
})
export class DependenciaService {

  private http = inject(HttpClient);

  private apiUrl:string = appsettings.apiApp + "Dependencia";

  getList(): Observable<Dependencia[]> {
    var list= this.http.get<Dependencia[]>(this.apiUrl+'/GetList');
  
    return list;
  }

  getPagination(no_pagina: number, filtro: string): Observable<DependenciaPagination> {
    var list= this.http.get<DependenciaPagination>(`${this.apiUrl}/GetPagination/${no_pagina}/${filtro}`);
    return list;
  }

  GetRaiz(): Observable<Result<TreeDependencia[]>> {
    var list= this.http.get<Result<TreeDependencia[]>>(`${this.apiUrl}/GetRaiz`);
    return list;
  }

  saveByDependenciaId(ObjInput:DepOut): Observable<Result<Dependencia>> {
    var re= this.http.post<Result<Dependencia>>(`${this.apiUrl}/SaveByDependenciaId`, ObjInput);
    return re;
  }

  updateName(ObjInput:DepOut): Observable<Result<Dependencia>> {
    var resp= this.http.put<Result<Dependencia>>(`${this.apiUrl}/UpdateName`, ObjInput);
    return resp;
  }
}


/*
return this.http.post<LoginResult>(this.apiUrl+ 'login',{
      "username": email,
      "password": password
    })
*/