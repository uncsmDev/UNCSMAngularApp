import { Injectable, inject } from '@angular/core';
import { appsettings } from '../../Settings/appsettings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Archivo, ArchivoResponse } from '../../interfaces/archivo';

@Injectable({
  providedIn: 'root'
})
export class ArchivoService {

  private http = inject(HttpClient);
  public file:any;
  private apiUrl:string = appsettings.apiApp + "Archivos";

 
  constructor() { }

  archivo!:Archivo;

  post(fileData:FormData): Observable<ArchivoResponse> {
        //const headers = { 'content-type': 'multipart/form-data'} 
   const headers = new HttpHeaders();
   headers.append('Content-Type', 'multipart/form-data');
    return this.http.post<ArchivoResponse>(this.apiUrl+'/Upload',fileData)
  }

  
}
