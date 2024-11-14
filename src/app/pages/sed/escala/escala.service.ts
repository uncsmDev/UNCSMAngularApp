import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Escala } from '../../../interfaces/escala';
import { appsettings } from '../../../Settings/appsettings';
import { FormGroup } from '@angular/forms';

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
    return this.http.post(this.apiUrl, body,{'headers':headers})
  }

  put(escala:Escala): Observable<any> {
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(escala);
    return this.http.put(this.apiUrl+'/'+escala.id, body,{'headers':headers})
  }

  delete(escala?:Escala | null): Observable<any> {
    return this.http.delete(this.apiUrl+'/'+escala?.id)
  }

  convertirAGrupoAObjeto(escalaForm: FormGroup): Escala {
    return {
      id: escalaForm.get('id')?.value == '' || escalaForm.get('id')?.value == null ? 0 : escalaForm.get('id')?.value,
      nombre: escalaForm.get('nombre')?.value,
      simbologia: escalaForm.get('simbologia')?.value,
      valoracion: parseInt(escalaForm.get('valoracion')?.value),
      nivelCumplimiento: escalaForm.get('nivelcumplimiento')?.value,
      eliminado: false,
      visible: true,
    };
  }
}
