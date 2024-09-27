import { Injectable, inject } from '@angular/core';
import { appsettings } from '../../Settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {TipoEntidad, TipoTrabajador} from '../../interfaces/tipoEntidad';
import { Result } from '@interfaces/Result.interface';
import { Instrumento } from '@interfaces/instrumento';

@Injectable({
  providedIn: 'root'
})
export class TipoTrabajadorService {

  private http = inject(HttpClient);

  private apiUrl:string = appsettings.apiApp + "TipoTrabajador";
  constructor() { }

  getList() {
    var list= this.http.get<TipoEntidad[]>(this.apiUrl+'/GetList');
    return list;
  }

  get() {
    var list= this.http.get<Result<TipoTrabajador[]>>(this.apiUrl);
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
  getOne(id:number)
  {
    return this.http.get<Result<TipoTrabajador>>(`${this.apiUrl}/GetOne/${id}`);
  }
}
