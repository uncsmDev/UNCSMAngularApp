import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { appsettings } from '../Settings/appsettings';
import { SubModulo } from '../interfaces/submodulo';
import { LoginResult } from '../interfaces/acount';

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

  
}
