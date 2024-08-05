import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { appsettings } from '../Settings/appsettings';
import { Modulo, ModuloView } from '../interfaces/modulo';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModuloService {

  private http = inject(HttpClient);
  private apiUrl:string = appsettings.apiApp + "Modulo";

  constructor() { }
  
  get(): Observable<Modulo[]> {
 
    const tokenStorage = sessionStorage.getItem("loggedInUser");
  
    if (tokenStorage!== null && tokenStorage!== undefined) {
      try {
        // Intenta convertir la cadena en un objeto JSON
        const tokenJSON = JSON.parse(tokenStorage);

        const idUser = tokenJSON.token;

        // Construye la URL completa incluyendo el Email del usuario
        const url = `${this.apiUrl}/GetModuloxUser?id=${idUser}`;
  
        // Realiza la solicitud GET
        return this.http.get<Modulo[]>(url);
      } catch (error) {
        // Maneja el error en caso de que la cadena no sea un JSON válido
        console.error("Error al parsear el usuario:", error);
        throw new Error("Error al parsear el usuario"); // Considera lanzar el error para manejarlo en el componente
      }
    } else {
      // Maneja el caso en que "loggedInUser" no está presente en sessionStorage
      console.log("No se encontró el usuario en sessionStorage.");
      throw new Error("Usuario no encontrado en sessionStorage"); // Considera lanzar el error para manejarlo en el componente
    }
  }
  
  getList()
  {
    return this.http.get<Modulo[]>(this.apiUrl+'/GetList');
  }


  post(modulo:ModuloView): Observable<Modulo> {
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(modulo);

    return this.http.post<Modulo>(this.apiUrl+'/Insert', body,{headers});
  }
 
}
