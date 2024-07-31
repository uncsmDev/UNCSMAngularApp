import { Injectable, inject } from '@angular/core';
import { appsettings } from '../../Settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PackPage } from '../../interfaces/packPage';
import {Entidad, EntidadDto} from '../../interfaces/entidad'
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class EntidadService {

  private http = inject(HttpClient);

  private apiUrl:string = appsettings.apiApp + "Entidad";

  constructor() { }
  
  getList(iPag:number): Observable<PackPage<Entidad>> {
    return this.http.get<PackPage< Entidad>>(this.apiUrl+'/GetList?pagina='+iPag);
  }

  googleLogin(idToken: string) {
    return this.http.post<{ token: string }>(
      this.apiUrl + 'google-login',
      {
        idToken: idToken,
      }
    );
  }

  put(entidad:EntidadDto): Observable<any> {
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(entidad);
    return this.http.put(this.apiUrl+'/'+entidad.id, body,{'headers':headers})
  }

  post(entidad:EntidadDto): Observable<any> {
    const headers = { 'content-type': 'application/json'} 
    const body=JSON.stringify(entidad);
    return this.http.post(this.apiUrl+'/PostMaster', body,{'headers':headers})
  }
 
  
  eliminar(entidad?:Entidad|null): Observable<any> {
    return this.http.delete(this.apiUrl+'/Delete/'+entidad?.id)
  }

  convertirAGrupoAObjeto(entidadForm: FormGroup): EntidadDto {
    return {
      id: entidadForm.get('id')?.value == '' || entidadForm.get('id')?.value == null ? 0 : entidadForm.get('id')?.value,
      codigo:entidadForm.get('codigo')?.value,
      dni:entidadForm.get('dni')?.value,
      nombres: entidadForm.get('nombres')?.value,
      apellidos: entidadForm.get('apellidos')?.value,
      sexoId: parseInt(entidadForm.get('sexoId')?.value),
      fechaIngreso: entidadForm.get('fechaIngreso')?.value,
      cargoId:parseInt(entidadForm.get('cargoId')?.value),
      tipoEntidadId:entidadForm.get('tipoEntidadId')?.value,
      dependenciaId: parseInt(entidadForm.get('dependenciaId')?.value),
    };
  }

}
