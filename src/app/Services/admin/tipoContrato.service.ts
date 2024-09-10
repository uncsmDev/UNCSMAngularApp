import { Injectable, inject } from '@angular/core';
import { appsettings } from '../../Settings/appsettings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PackPage } from '../../interfaces/packPage';
import { TipoContrato } from '@interfaces/tipo_contrato';
import { Result } from '@interfaces/Result.interface';

@Injectable({
  providedIn: 'root'
})
export class TipoContratoService {

  private http = inject(HttpClient);
  private apiUrl:string = appsettings.apiApp + "TipoContrato";

  constructor() { }

  getList(): Observable<Result<TipoContrato[]>> {
    return this.http.get<Result<TipoContrato[]>>(this.apiUrl+'/GetList');
  }
    
}