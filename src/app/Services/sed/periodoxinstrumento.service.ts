import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PeriodoxInstrumento } from '@interfaces/periodoxinstrumento.';
import { Result } from '@interfaces/Result.interface';
import { appsettings } from 'app/Settings/appsettings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeriodoxinstrumentoService {

  http = inject(HttpClient)
  ruta = appsettings.apiApp + 'PeriodoxInstrumento'

  getByInstrumentoPeriodo(InstrumentoId: number, PeriodoId: number): Observable<Result<PeriodoxInstrumento>>{
    return this.http.get<Result<PeriodoxInstrumento>>(`${this.ruta}/GetByInstrumentoPeriodo/${InstrumentoId}/${PeriodoId}`)
  }

  del(periodoxInstrumento: PeriodoxInstrumento): Observable<Result<PeriodoxInstrumento>>{
    return this.http.delete<Result<PeriodoxInstrumento>>(`${this.ruta}/${periodoxInstrumento.periodoId}/${periodoxInstrumento.instrumentoId}`)
  }

  post(periodoxInstrumento: PeriodoxInstrumento): Observable<Result<PeriodoxInstrumento>>{
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(periodoxInstrumento);
    return this.http.post<Result<PeriodoxInstrumento>>(this.ruta, body, {headers});
  }

  update(periodoId: number, instrumentoId:number, periodoxInstrumento: PeriodoxInstrumento): Observable<Result<PeriodoxInstrumento>>{
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(periodoxInstrumento);
    return this.http.put<Result<PeriodoxInstrumento>>(`${this.ruta}/${periodoId}/${instrumentoId}`, body, {headers});
  }
}
