import { Injectable, inject } from '@angular/core';
import { Escala } from '../interfaces/escala';
import { HttpClient } from '@angular/common/http';
import { appsettings } from '../Settings/appsettings';
import { Observable } from 'rxjs';

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
}
