import {ChangeDetectionStrategy, Component, inject, input, signal, viewChild, type OnInit} from '@angular/core';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import { EvaluacionTrabajadorService } from '@services/sed/EvaluacionTrabajador.service';
import { TitleComponent } from 'app/shared/title/title.component';
import { firstValueFrom } from 'rxjs';
import { RespuestaAbiertaDTO } from '@interfaces/DTOs/respuesta.interface';
import { NativeDialogComponent } from 'app/components/nativeDialog/nativeDialog.component';
import { TokenData } from '@interfaces/acount';
import { jwtDecode } from 'jwt-decode';
import { TrabajadorService } from '@services/admin/trabajador.service';
import { Trabajador } from '@interfaces/trabajador';

interface DimensionData 
{
  dimensionId: number, 
  dimension: string,
  preguntas: Pregunta[]
  total?: number;
}

interface Pregunta{
  id: number,
  nombre: string,
  respuestaId: number;
  escala: string;
  valoracion: number;
}

@Component({
  selector: 'app-resultados-instrumento',
  imports: [MatExpansionModule, TitleComponent, NativeDialogComponent],
  templateUrl: './resultados-instrumento.component.html',
  styleUrl: './resultados-instrumento.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ResultadosInstrumentoComponent implements OnInit {
  accordion = viewChild.required(MatAccordion);
  evaluacionSvc = inject(EvaluacionTrabajadorService);
  trabajadorSvc = inject(TrabajadorService);
  evaluacionId = input<number>(0, {alias: 'evaluacionId'})
  resultadoInstrumentoSignal = signal<DimensionData[]>([]);
  resultadoInstrumentoAbiertaSignal = signal<RespuestaAbiertaDTO[]>([]);

  ngOnInit(): void { 
    const evaluador = this.getResultados();
    this.getInstrumentoResultado(evaluador);
    this.getInstrumentoResultadoCualitativo(evaluador);
  }

  async getInstrumentoResultado(evaluador: Promise<Trabajador>){
    const trabajadorId = (await evaluador).id;
    const data = await firstValueFrom(this.evaluacionSvc.getResultadoEvaluacion(this.evaluacionId(), trabajadorId));

    if(data.data != null)
    {
      const dimensiones = data.data.reduce((obj: DimensionData[], pregunta) => {
        let existingDimension = obj.find(d => d.dimensionId === pregunta.dimensionId);
  
        if(!existingDimension){
          existingDimension = {
            dimensionId: pregunta.dimensionId,
            dimension: pregunta.dimensionNombre,
            preguntas: [],
            total: 0
          }
          obj.push(existingDimension);
        }
  
        existingDimension.preguntas.push({
          id: pregunta.preguntaCerradaId,
          nombre: pregunta.preguntaCerradaNombre,
          respuestaId: pregunta.respuestaCerradaId,
          escala: pregunta.escalaNombre,
          valoracion: pregunta.escalaValoracion
        });
  
        return obj;
      }, [] as DimensionData[]);
  
      this.resultadoInstrumentoSignal.set(dimensiones);

      this.resultadoInstrumentoSignal().forEach(dimension => {
        dimension.preguntas.forEach(pregunta => {
          dimension.total! += pregunta.valoracion;
        })
      })
    }
    }

    async getInstrumentoResultadoCualitativo(evaluador: Promise<Trabajador>){
      const trabajadorId = (await evaluador).id;
      const data = await firstValueFrom(this.evaluacionSvc.GetResultadoEvaluacionCualitativa(this.evaluacionId(), trabajadorId));
      if(data.data != null)
      {
        const datos = data.data;
        this.resultadoInstrumentoAbiertaSignal.set(datos);
      }
      }

      aceptarResultados(){
        console.log("Funciona")
      }

      async getResultados(){
          const res = JSON.parse(sessionStorage.getItem('loggedInUser')!);
          const decodedToken:TokenData = jwtDecode(res.token);
          const result= await firstValueFrom(this.trabajadorSvc.GetIdTrabajadorByUserId(decodedToken.nameid));
          return result.data;
        }
}
