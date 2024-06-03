import { Injectable, inject } from '@angular/core';
import { appsettings } from '../Settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioViewModel } from '../interfaces/usuario';
import { PackPage } from '../interfaces/packPage';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private http = inject(HttpClient);

  private apiUrl:string = appsettings.apiApp + "Usuario";

  constructor() { }

  /*get(): Observable<UsuarioViewModel[]> {
    return this.http.get<UsuarioViewModel[]>(this.apiUrl+'/GetList');
  }*/

  get(iPag:number): Observable<PackPage< UsuarioViewModel>> {
    return this.http.get<PackPage< UsuarioViewModel>>(this.apiUrl+'/GetList?pagina='+iPag);
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
