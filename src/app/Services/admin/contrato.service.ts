import { inject, Injectable, input } from '@angular/core';
import { appsettings } from '../../Settings/appsettings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PackPage, Paginacion } from '@interfaces/packPage';
import { Contrato } from '@interfaces/Contrato.interface';
import { Result, ResultEnum } from '@interfaces/Result.interface';


@Injectable({
  providedIn: 'root'
})
export class ContratoService {

  private http = inject(HttpClient);

  private apiUrl:string = appsettings.apiApp + "Contrato";

  constructor() { }

  Create(input:Contrato): Observable<Result<Contrato>>
  {
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(input);
    console.log('JSON:::: '+body);
    console.log(input);
    return this.http.post<Result<Contrato>>(this.apiUrl+'/Insert', body,{'headers':headers})
  }

  FinalizaContrato(input:number): Observable<Result<Contrato>>
  {
   return this.http.delete<Result<Contrato>>(this.apiUrl+'/FinalizaContrato?id='+input);
    //return this.http.post<Result<Contrato>>(this.apiUrl+'/FinalizaContrato', body,{'headers':headers})
  }
}
