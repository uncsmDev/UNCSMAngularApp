import { Injectable, inject } from '@angular/core';
import { appsettings } from '../../Settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dependencia } from '../../interfaces/dependencia';


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

  googleLogin(idToken: string) {
    return this.http.post<{ token: string }>(
      this.apiUrl + 'google-login',
      {
        idToken: idToken,
      }
    );
  }

  constructor() { }
}
