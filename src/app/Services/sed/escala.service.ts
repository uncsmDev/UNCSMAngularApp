import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Escala } from '../../interfaces/escala';
import { appsettings } from '../../Settings/appsettings';

@Injectable({
  providedIn: 'root'
})
export class EscalaService {
  private http = inject(HttpClient);
  private apiUrl:string = appsettings.apiApp + "Escala";
  constructor() { }

  get(): Observable<Escala[]> {
        const url = `${this.apiUrl}`;
        return this.http.get<Escala[]>(url);
  }
  post(escala:Escala): Observable<any> {
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(escala);
    console.log(body)
    return this.http.post(this.apiUrl, body,{'headers':headers})
  }

  put(escala:Escala): Observable<any> {
    debugger
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(escala);
    console.log(body)
    return this.http.put(this.apiUrl+'/'+escala.id, body,{'headers':headers})
  }
}
