import { Injectable, inject } from '@angular/core';
import { appsettings } from '../../Settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Cargo} from '../../interfaces/cargo';

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

  googleLogin(idToken: string) {
    return this.http.post<{ token: string }>(
      this.apiUrl + 'google-login',
      {
        idToken: idToken,
      }
    );
  }
}
