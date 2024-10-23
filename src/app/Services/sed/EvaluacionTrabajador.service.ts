import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { InstrumentoDTO } from '@interfaces/DTOs/InstrumentoDTO.interface';
import { PersonaInfoDTO } from '@interfaces/DTOs/PersonaInfoDTO.interface';
import { Escala } from '@interfaces/escala';
import { EvaluacionTrabajador } from '@interfaces/EvaluacionTrabajador.interface';
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
    return this.http.get<Result<InstrumentoDTO>>(`${this.apiUrl}/GetInstrumento/${tipoTrabajadorId}/${tipoEvaluacionId}/${evaluacionId}`);
  }

  getTipoEvaluacionHabilitada(evaluacionId: number){
    return this.http.get<Result<EvaluacionTrabajador>>(`${this.apiUrl}/GetTipoEvaluacionHabilitada/${evaluacionId}`);
  }

  GetNextStep(dimensionId: number, evaluacionId: number){
    return this.http.get<Result<true>>(`${this.apiUrl}/NextStep/${dimensionId}/${evaluacionId}`);
  }

  updateEscala(id: number, valor: number){
    const headers = {'content-type': 'application/json'}
    const body = JSON.stringify(valor);
    return this.http.put<Result<Instrumento>>(`${this.apiUrl}/PutEscalaResponse/${id}`, body, {headers});
  }

  updateFinishEvaluacion(id: number){
    const headers = {'content-type': 'application/json'}
    return this.http.put<Result<Instrumento>>(`${this.apiUrl}/PutFinishEvaluacion/${id}`, {}, {headers});
  }

  updateInicioEvaluacion(id: number){
    const headers = {'content-type': 'application/json'}
    return this.http.put(`${this.apiUrl}/updateFechaInicioEvaluacion/${id}`, {}, {headers});
  }

  updateFinishEvaluacionCuantitativa(id: number){
    const headers = {'content-type': 'application/json'}
    return this.http.put(`${this.apiUrl}/UpdateFinishEvaluacionCuantitativa/${id}`, {}, {headers});
  }

}
