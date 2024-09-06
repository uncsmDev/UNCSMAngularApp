import { Injectable, inject } from '@angular/core';
import { appsettings } from '../../Settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {TipoEntidad, TipoEntidadI} from '../../interfaces/tipoEntidad';
import { Result } from '@interfaces/Result.interface';
import { Instrumento } from '@interfaces/instrumento';

@Injectable({
  providedIn: 'root'
})
export class TipoEntidadService {

  private http = inject(HttpClient);

  private apiUrl:string = appsettings.apiApp + "TipoEntidad";
  constructor() { }

  getList(): Observable<TipoEntidad[]> {
    var list= this.http.get<TipoEntidad[]>(this.apiUrl+'/GetList');
  
    return list;
  }

  getTipoEntidadByInstrumento(instrumento: Instrumento): Observable<Result<TipoEntidad>> {
    var list= this.http.get<Result<TipoEntidad>>(this.apiUrl+'/GetTipoEntidad/'+instrumento.id);
    return list;
  }

  getListByFilterName(filter:string):Observable<Result<TipoEntidad[]>>
  {
    var list= this.http.get<Result<TipoEntidad[]>>(this.apiUrl+'/GetByFilterName?filter='+filter);
    return list;
  }


  getListByIdEntidad(id:number,filter:string):Observable<Result<TipoEntidad[]>>
  {
    var list= this.http.get<Result<TipoEntidad[]>>(this.apiUrl+'/GetListByEntidadId?id='+id+'&filter='+filter);
    return list;
  }

  getListByIdEntidadI(id:number,filter:string):Observable<Result<TipoEntidadI[]>>
  {
    var list= this.http.get<Result<TipoEntidadI[]>>(this.apiUrl+'/GetListByEntidadId?id='+id+'&filter='+filter);
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
