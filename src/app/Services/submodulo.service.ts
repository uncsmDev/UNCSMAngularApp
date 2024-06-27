import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { appsettings } from '../Settings/appsettings';
import { SubModulo, SubModuloXUser, SubModuloXUserView } from '../interfaces/submodulo';
import { LoginResult } from '../interfaces/acount';
import { PackPage } from '@interfaces/packPage';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Result } from '@interfaces/Repuesta';

@Injectable({
  providedIn: 'root'
})
export class SubmoduloService {

  private http = inject(HttpClient);
  private apiUrl:string = appsettings.apiApp + "SubModulo";
  constructor() { }

  getSubModulo(id:number)
  {
    const url = `${this.apiUrl}`;
    const tokenString = sessionStorage.getItem("loggedInUser");
    const token: LoginResult = tokenString ? JSON.parse(tokenString) : null;
    
    return this.http.get<SubModulo[]>(url + `/GetListUser?id=${id}&userID=${token.idUser}`);
  }

  googleLogin(idToken: string) {
    return this.http.post<{ token: string }>(
      this.apiUrl + 'google-login',
      {
        idToken: idToken,
      }
    );
  }


  getListByModulo(id:number,filtro:string) //id: id Modulo.// Obtiene lista de submodulo que contienen un id de modulo
  {
    return this.http.get<SubModulo[]>(this.apiUrl+'/GetListByModulo?id='+id+'&filter='+filtro);
  }

  getList(iPag:number): Observable<PackPage<SubModulo>> {
    return this.http.get<PackPage<SubModulo>>(this.apiUrl+'/GetList?pagina='+iPag);
  }

  post(subModulo:SubModulo): Observable<SubModulo> {
    const headers = { 'content-type': 'application/json'} 
    const body=JSON.stringify(subModulo);
    return this.http.post<SubModulo>(this.apiUrl+'/Insert', body,{'headers':headers})
  }

  put(subModulo:SubModulo): Observable<any> {
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(subModulo);
    return this.http.put(this.apiUrl+'/Update/'+subModulo.id, body,{'headers':headers})
  }

  eliminar(sbm?:SubModulo|null): Observable<any> {
    return this.http.delete(this.apiUrl+'/Delete/'+sbm?.id)
  }

  getSubModuloListByUser(idUser:string,pag:number):Observable<PackPage<SubModuloXUserView>>
  {
    const url = `${this.apiUrl}`;
    return this.http.get<PackPage<SubModuloXUserView>>(this.apiUrl+'/GetListByUserView?id='+idUser+'&pagina='+pag);
   // return this.http.get<PackPage<SubModulo>>(url + `/GetListByUserView?id=${idUser}`);
  }

  insertSubModuloXUsuario(smxu:SubModuloXUser):Observable<Result<SubModuloXUser>>
  {
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(smxu);
    return this.http.post<Result<SubModuloXUser>>(this.apiUrl+'/InsertXUser',body,{'headers':headers})
  }

}
