import { Injectable, inject } from '@angular/core';
import { appsettings } from '../../Settings/appsettings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Trabajador} from '../../interfaces/trabajador';
import { Result } from '@interfaces/Result.interface';
import { PackPage, Paginacion } from '@interfaces/packPage';
import { TrabajadorDto, TrabajadorInput } from '@interfaces/trabajadorInput';
import { Persona } from '@interfaces/persona';
import { DatosPersonalesInput } from '@interfaces/Updates/datosPersonalesInput ';

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

  UpdatePersonalData(input:DatosPersonalesInput):Observable<Result<Persona>>
  { 
    var re=this.http.put<Result<Persona>>(this.apiUrl+'/UpdatePersonalData',input);
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
}
