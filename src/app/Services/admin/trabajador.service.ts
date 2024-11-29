import { Injectable, inject } from '@angular/core';
import { appsettings } from '../../Settings/appsettings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Trabajador} from '../../interfaces/trabajador';
import { Result } from '@interfaces/Result.interface';
import { PackPage, Paginacion } from '@interfaces/packPage';
import { TrabajadorDto, TrabajadorInput } from '@interfaces/trabajadorInput';
import { Persona } from '@interfaces/persona';
import { DatosPersonalesInput, InformacionPersonal } from '@interfaces/Updates/datosPersonalesInput ';
import { TrabajadorDetalle, TrabajadorUserDetalle } from '@interfaces/ViewsInterfaces/TrabajadorDetalle';

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

  UpdatePersonalData(input:DatosPersonalesInput,file?:File):Observable<Result<Persona>>
  { 
    const formData:FormData = new FormData();

    if(file && file.size > 0)
      formData.append('File', file, file.name);


    Object.keys(input).forEach(key => {
      const value = (input as any)[key]; // Obtener el valor de la propiedad
    
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    var re=this.http.put<Result<Persona>>(this.apiUrl+'/UpdatePersonalData',formData, {  headers: new HttpHeaders({ 'Accept': '*/*' })});
    return re;
  }
  UpdateInfoData(Input:InformacionPersonal):Observable<Result<Persona>>
  {
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(Input);
    var re=this.http.put<Result<Persona>>(this.apiUrl+'/UpdateInfoData',body, {'headers':headers});
    return re; 
  }


  postFull(data:TrabajadorInput,file?:File|any) : Observable<Result<Persona>>
  {
    const formData:FormData = new FormData();

    if(file && file.size > 0)
      formData.append('File', file, file.name);


    Object.keys(data).forEach(key => {
      const value = (data as any)[key]; // Obtener el valor de la propiedad
    
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    formData.delete('SubModulos');
    formData.append('SubModulos', JSON.stringify(data.SubModulos));
    return this.http.post<Result<any>>(this.apiUrl+'/PostFull',formData, {  headers: new HttpHeaders({ 'Accept': '*/*' })});
  }
  
  getById(id:number): Observable<Result<TrabajadorDto>>   
  {
    var trabajador= this.http.get<Result<TrabajadorDto>>(this.apiUrl+'/GetById?IdTrabajador='+id);
    return trabajador;
  }

  getDetalleContratos(idTrabajador:number): Observable<Result<TrabajadorDetalle>>   
  {
    var trabajador= this.http.get<Result<any>>(this.apiUrl+'/GetDetalleTrabajadorContratos?Id='+idTrabajador);
    return trabajador;
  }

  getDetalleUser(idTrabajador:number): Observable<Result<TrabajadorUserDetalle>>   
  {
    var trabajador= this.http.get<Result<any>>(this.apiUrl+'/GetDetalleTrabajadorUser?Id='+idTrabajador);
    return trabajador;
  }

  buscarRestaurarUsuario(input:number):Observable<Result<any>>
  {
    var userStatus= this.http.get<Result<any>>(this.apiUrl+'/BuscarRestaurarUser?IdTrabajador='+input);
    return userStatus;
  }
}
