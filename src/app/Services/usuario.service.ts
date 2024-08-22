import { Injectable, inject } from '@angular/core';
import { appsettings } from '../Settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InsertUsuario, UsuarioView, UsuarioViewModel } from '../interfaces/usuario';
import { PackPage } from '../interfaces/packPage';
import { Result } from '@interfaces/Result.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private http = inject(HttpClient);

  private apiUrl:string = appsettings.apiApp + "Usuario";
  private api:string=appsettings.apiUrl+'Account/';

  constructor() { }

  /*get(): Observable<UsuarioViewModel[]> {
    return this.http.get<UsuarioViewModel[]>(this.apiUrl+'/GetList');
  }*/

  get(iPag:number): Observable<PackPage< UsuarioViewModel>> {
    return this.http.get<PackPage< UsuarioViewModel>>(this.apiUrl+'/GetList?pagina='+iPag);
  }


  registerUser(insert:InsertUsuario):Observable<any>
  {
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(insert);
    return this.http.post(this.api+'register', body,{'headers':headers})
  }

  getByEntidadId(id?:number):Observable<UsuarioView[]>
  {
    var list= this.http.get<UsuarioView[]>(this.apiUrl+'/GetByEntidadId?id='+id);
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
