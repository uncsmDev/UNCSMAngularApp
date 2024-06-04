import { Injectable, inject } from '@angular/core';
import { appsettings } from '../../Settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PackPage } from '../../interfaces/packPage';
import {Entidad} from '../../interfaces/entidad'

@Injectable({
  providedIn: 'root'
})
export class EntidadService {

  private http = inject(HttpClient);

  private apiUrl:string = appsettings.apiApp + "Entidad";

  constructor() { }
  
  getList(iPag:number): Observable<PackPage<Entidad>> {
    return this.http.get<PackPage< Entidad>>(this.apiUrl+'/GetList?pagina='+iPag);
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
