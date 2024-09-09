import { Injectable, inject } from '@angular/core';
import { appsettings } from '../../Settings/appsettings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PackPage } from '../../interfaces/packPage';
import {Entidad, EntidadDto, EntidadFullDto} from '../../interfaces/entidad'
import { FormGroup } from '@angular/forms';
import { Result } from '@interfaces/Result.interface';

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
 

  /*postFull(entidad:EntidadFullDto): Observable<any> {
    const headers = { 'Content-Type': 'multipart/form-data'} 
    const body=JSON.stringify(entidad);
    return this.http.post(this.apiUrl+'/PostFullMaster', body,{'headers':headers})
  }
 */
  /*post(fileData:FormData): Observable<ArchivoResponse> {
    //const headers = { 'content-type': 'multipart/form-data'} 
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    return this.http.post<ArchivoResponse>(this.apiUrl+'/Upload',fileData)
}
*/

postFull(entidad:EntidadFullDto):Observable<any>
{
  const headers = new HttpHeaders();
  headers.append('Content-Type', 'multipart/form-data');
  headers.append( 'Accept', '*/*');
  return this.http.post(this.apiUrl+'/PostFullMaster',entidad);
  
}


postFullMaster(data: EntidadFullDto, file?: File|any): Observable<Result<any>> {
  const formData: FormData = new FormData();

    // Append the file
  if(file && file.size > 0)
    formData.append('File', file, file.name);


  // Append other fields
  formData.append('Dni', data.dni);
  formData.append('Codigo',data.codigo.toString());
  formData.append('Nombres', data.nombres);
  formData.append('Apellidos', data.apellidos);
  formData.append('SexoId', data.sexoId.toString());
  formData.append('FechaIngreso', data.fechaIngreso.toString());
  formData.append('CorreoPersonal', data.email);
  formData.append('Ubicacion', 'Usuarios');
  formData.append('SubCarpeta', 'IdUserNet');
  formData.append('Email', data.email);
  formData.append('Password', data.password);
  formData.append('ConfirmPassword', data.confirmPassword);
  formData.append('Telefono', data.telefono);
  formData.append('TipoEntidades', JSON.stringify(data.tipoEntidad));
  formData.append('CargoId', data.cargoId?.toString());
  formData.append('DependenciaId', data.dependenciaId.toString());
  formData.append('SubModulos', JSON.stringify(data.SubModulos));
  formData.append('TipoContradoId', data.tipoContratoId.toString());
  formData.append('FechaInicio', data.fechaInicio.toString());

  debugger;
  if(data.fechaFin.toString()!='')
    formData.append('FechaFin', data.fechaFin.toString());

  return this.http.post<Result<any>>(this.apiUrl+'/PostFullMaster', formData, {  headers: new HttpHeaders({ 'Accept': '*/*' })});
}



  getById(id:number):Observable<Result<Entidad>>
  {
    var element= this.http.get<Result<Entidad>>(this.apiUrl+'/GetById?id='+id);
  
    return element;
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
