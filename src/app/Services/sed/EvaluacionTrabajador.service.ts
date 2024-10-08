import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PersonaInfoDTO } from '@interfaces/DTOs/PersonaInfoDTO.interface';
import { Escala } from '@interfaces/escala';
import { Instrumento } from '@interfaces/instrumento';
import { Result } from '@interfaces/Result.interface';
import { appsettings } from 'app/Settings/appsettings';

@Injectable({
  providedIn: 'root'
})
export class EvaluacionTrabajadorService {
  private http = inject(HttpClient);
  private apiUrl:string = appsettings.apiApp + "EvaluacionTrabajador";

 
  getById(id: number){
    return this.http.get<Result<PersonaInfoDTO[]>>(`${this.apiUrl}/GetById/${id}`);
  }

  GetPersonalByIdDependencia(DependenciaId: number, personaId: number){
    return this.http.get<Result<PersonaInfoDTO[]>>(`${this.apiUrl}/GetPersonalByIdDependencia/${DependenciaId}/${personaId}`);
  }

  GetByIdEvaluado(id: number){
    return this.http.get<Result<PersonaInfoDTO>>(`${this.apiUrl}/GetByIdEvaluado/${id}`);
  }

  GetInstrumento(tipoTrabajadorId: number, tipoEvaluacionId: number, evaluacionId: number){
    return this.http.get<Result<Instrumento>>(`${this.apiUrl}/GetInstrumento/${tipoTrabajadorId}/${tipoEvaluacionId}/${evaluacionId}`);
  }

}
