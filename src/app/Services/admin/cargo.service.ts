import { Result } from '@interfaces/Result.interface';
import { Injectable, inject } from '@angular/core';
import { appsettings } from '../../Settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Cargo, CargoList, CargoPagination} from '../../interfaces/cargo';

@Injectable({
  providedIn: 'root'
})
export class CargoService {
  private http = inject(HttpClient);

  private apiUrl:string = appsettings.apiApp + "Cargo";

  constructor() { }

  getList(): Observable<Cargo[]> {
    var list= this.http.get<Cargo[]>(this.apiUrl+'/GetList');
    return list;
  }

  getWithoutEvaluacionCargo(id: number): Observable<Result<Cargo[]>> {
    var list= this.http.get<Result<Cargo[]>>(`${this.apiUrl}/GetWithoutEvaluacionCargo/${id}`);
    return list;
  }

  getPagination(no_pagina: number): Observable<CargoPagination> {
    var list= this.http.get<CargoPagination>(`${this.apiUrl}/GetPagination/${no_pagina}`);
    return list;
  }

  getCargo(id: number): Observable<Result<Cargo>> {
    var list= this.http.get<Result<Cargo>>(`${this.apiUrl}/GetCargo/${id}`);
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
