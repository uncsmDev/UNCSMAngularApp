import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EvaluacionTrabajadorDTO, EvaluacionTrabajadorResultadoDTO, InstrumentoAbiertoDTO } from '@interfaces/DTOs/InstrumentoDTO.interface';
import { IEvaluadoDataProcedureDTO, PersonaDTO, PersonaInfoDTO, PersonalPorDependenciaDTO, ResultadosEvaluacionJefe } from '@interfaces/DTOs/PersonaInfoDTO.interface';
import { RespuestaAbiertaDTO, RespuestaDTO } from '@interfaces/DTOs/respuesta.interface';
import { EvaluacionTrabajador } from '@interfaces/EvaluacionTrabajador.interface';
import { Instrumento } from '@interfaces/instrumento';
import { Result } from '@interfaces/Result.interface';
import { EvaluacionEscala } from 'app/pages/sed/home/AplicacionEvaluacion/AplicacionEvaluacion.component';
import { appsettings } from 'app/Settings/appsettings';

@Injectable({
  providedIn: 'root'
})
export class EvaluacionTrabajadorService {
  private http = inject(HttpClient);
  private apiUrl:string = appsettings.apiApp + "EvaluacionTrabajador";

 
  getCountPersonal(userId: string){
    return this.http.get<Result<boolean>>(`${this.apiUrl}/GetCountEvaluaciones/${userId}`);
  }

  getResultadoEvaluacion(evaluacionId: number, evaluadorId: number){
    const headers = {'content-type': 'application/json'}
    const body = JSON.stringify(evaluadorId);
    
    return this.http.post<Result<EvaluacionTrabajadorResultadoDTO[]>>(`${this.apiUrl}/GetResultadoEvaluacion/${evaluacionId}`, body, {headers: headers});
  }

  GetResultadoEvaluacionCualitativa(evaluacionId: number, evaluadorId: number){
    const headers = {'content-type': 'application/json'}
    const body = JSON.stringify(evaluadorId);
    return this.http.post<Result<RespuestaAbiertaDTO[]>>(`${this.apiUrl}/GetResultadoEvaluacionCualitativa/${evaluacionId}`, body, {headers});
  }

  getById(id: number){
    return this.http.get<Result<PersonaDTO>>(`${this.apiUrl}/GetById/${id}`);
  }

  getResultByUserId(userId: string){
    const headers = {'content-type': 'application/json'}
    const body = JSON.stringify(userId);
    return this.http.post<Result<ResultadosEvaluacionJefe[]>>(`${this.apiUrl}/GetResultados/`, body, {headers});
  }

  getPersonalDependencia(DependenciaId: number, personaId: number){
    return this.http.get<Result<PersonalPorDependenciaDTO[]>>(`${this.apiUrl}/GetPersonalDependencia/${DependenciaId}`);
  }

  GetByIdEvaluado(evaluacionId: number, evaluadorId: string){
    const headers = {'content-type': 'application/json'}
    const body = JSON.stringify(evaluadorId);
    return this.http.post<Result<IEvaluadoDataProcedureDTO>>(`${this.apiUrl}/GetEvaluacionTrabajador/${evaluacionId}`, body, {headers});
  }

  GetInstrumento(evaluacionId: number){
    return this.http.get<Result<EvaluacionTrabajadorDTO[]>>(`${this.apiUrl}/GetInstrumento/${evaluacionId}`);
  }

  GetInstrumentoCualitativo(tipoTrabajadorId: number, tipoEvaluacionId: number, evaluacionId: number){
    return this.http.get<Result<InstrumentoAbiertoDTO>>(`${this.apiUrl}/GetInstrumentoCualitativo/${tipoTrabajadorId}/${tipoEvaluacionId}/${evaluacionId}`);
  }
  GetNextStep(dimensionId: number, evaluacionId: number){
    return this.http.get<Result<true>>(`${this.apiUrl}/NextStep/${dimensionId}/${evaluacionId}`);
  }

    updateEscala(data: EvaluacionEscala[]){
      const headers = {'content-type': 'application/json'}
      const body = JSON.stringify(data);
      return this.http.put<Result<boolean>>(`${this.apiUrl}/PutEscalaResponse/`, body, {headers});
    }

  updateRespuestaAbierta(respuesta: RespuestaDTO[]){
    const headers = {'content-type': 'application/json'}
    const body = JSON.stringify(respuesta);
    return this.http.put<Result<boolean>>(`${this.apiUrl}/UpdateInstrumentoCualitativo/`, body, {headers});
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

  UpdateFinishEvaluacionCualitativa(id: number){
    const headers = {'content-type': 'application/json'}
    return this.http.put(`${this.apiUrl}/UpdateFinishEvaluacionCualitativa/${id}`, {}, {headers});
  }

  

}
