import { Result } from './../../interfaces/Result.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { appsettings } from '../../Settings/appsettings';
import { Observable } from 'rxjs';
import { TipoEntidad } from '../../interfaces/tipoEntidad';
import { TipoEvaluacion } from '../../interfaces/tipo_evaluacion';
import { Instrumento } from '../../interfaces/instrumento';
import { Dimension } from '../../interfaces/dimension';
import { PreguntasCerradas } from '../../interfaces/pregunta_cerradas';
import { TipoPregunta } from '../../interfaces/tipo_pregunta';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class InstrumentoService {

  private http = inject(HttpClient);
  private ruta:string = appsettings.apiApp + 'Instrumento';
  private rutaDimension:string = appsettings.apiApp + 'Dimension';
  private rutaTipoEntidad:string = appsettings.apiApp + 'TipoEntidad/';
  private rutaTipoEvaluacion:string = appsettings.apiApp + 'TipoEvaluacion';

  constructor() { }

  getTipoEntidad(): Observable<TipoEntidad[]>
  {
    return this.http.get<TipoEntidad[]>(this.rutaTipoEntidad + 'GetList');
  }

  getTipoEvaluacion(): Observable<TipoEvaluacion[]>
  {
    return this.http.get<TipoEvaluacion[]>(this.rutaTipoEvaluacion)
  }

  post(instrumento: Instrumento): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(instrumento);
    return this.http.post(this.ruta, body, {headers});
  }

  postDimension(dimension: Dimension): Observable<Result<Dimension>>{
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(dimension);
    return this.http.post<Result<Dimension>>(this.rutaDimension, body, {headers});
  }
  
  put(ins: Instrumento): Observable<any>{
    const headers = {'content-type': 'application/json'}
    const body = JSON.stringify(ins);
    return this.http.put(`${this.ruta}/${ins.id}`, body, {headers});
  }

  putDimension(dimension: Dimension): Observable<any>{
    const headers = {'content-type': 'application/json'}
    const body = JSON.stringify(dimension);
    return this.http.put(`${this.rutaDimension}/${dimension.id}`, body, {headers});
  }

  get(): Observable<Instrumento[]>{
    return this.http.get<Instrumento[]>(this.ruta)
  }

  getOne(id:number): Observable<Result<Instrumento>>{
    return this.http.get<Result<Instrumento>>(`${this.ruta}/Get/${id}`)
  }

  delete(instrumento: Instrumento | null): Observable<any>{
    const id = instrumento!.id;
    return this.http.get(`${this.ruta}/DeleteVisible/${id}`);
  }

  deleteDimension(dimension: Dimension | null): Observable<Result<Dimension>>{
    const id = dimension!.id;
    return this.http.get<Result<Dimension>>(`${this.rutaDimension}/DeleteVisible/${id}`);
  }

  deleteAdmin(instrumento: Instrumento | null): Observable<any>{
    const id = instrumento!.id;
    return this.http.delete(`${this.ruta}/${id}`);
  }

  notZeroValidator(control: AbstractControl): ValidationErrors | null {
    return control.value != 0 ? null : { notZero: true };
  }
}
