import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { appsettings } from '../Settings/appsettings';
import { Modulo } from '../interfaces/modulo';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModuloService {

  private http = inject(HttpClient);
  private apiUrl:string = appsettings.apiApp + "Modulo";

  constructor() { }
  
  get():Observable<Modulo[]> {
    return this.http.get<Modulo[]>(this.apiUrl + '/GetList');
  }
}
