import { Injectable, inject } from '@angular/core';
import { appsettings } from '../Settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pais } from '../interfaces/pais';

@Injectable({
  providedIn: 'root'
})
export class PaisService {
  private http = inject(HttpClient);

  private apiUrl:string = appsettings.apiApp + "Pais";

  constructor() { }

  get(): Observable<Pais[]> {
    return this.http.get<Pais[]>(this.apiUrl);
  }
}
