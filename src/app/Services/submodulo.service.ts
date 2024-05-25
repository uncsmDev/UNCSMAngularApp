import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { appsettings } from '../Settings/appsettings';
import { SubModulo } from '../interfaces/submodulo';

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
    return this.http.get<SubModulo[]>(url + `/GetListUser?id=${id}`);
  }
}
