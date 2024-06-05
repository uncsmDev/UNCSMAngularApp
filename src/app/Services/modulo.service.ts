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
  
  get(): Observable<Modulo[]> {
 
    const user = sessionStorage.getItem("loggedInUser");
  
    if (user!== null && user!== undefined) {
      try {
        // Intenta convertir la cadena en un objeto JSON
        const userObject = JSON.parse(user);
  
        // Construye la URL completa incluyendo el Email del usuario
        const url = `${this.apiUrl}/GetModuloxUser?id=${userObject.idUser}`;
  
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
  
}
