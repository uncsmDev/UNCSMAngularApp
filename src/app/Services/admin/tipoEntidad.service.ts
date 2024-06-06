import { Injectable, inject } from '@angular/core';
import { appsettings } from '../../Settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {TipoEntidad} from '../../interfaces/tipoEntidad';

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

  googleLogin(idToken: string) {
    return this.http.post<{ token: string }>(
      this.apiUrl + 'google-login',
      {
        idToken: idToken,
      }
    );
  }
}
