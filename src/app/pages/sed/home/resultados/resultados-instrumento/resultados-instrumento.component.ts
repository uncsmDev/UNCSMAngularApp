import {ChangeDetectionStrategy, Component, inject, input, signal, viewChild, type OnInit} from '@angular/core';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import { EvaluacionTrabajadorService } from '@services/sed/EvaluacionTrabajador.service';
import { TitleComponent } from 'app/shared/title/title.component';
import { first, firstValueFrom } from 'rxjs';
import { RespuestaAbiertaDTO } from '@interfaces/DTOs/respuesta.interface';

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
  imports: [MatExpansionModule, TitleComponent],
  templateUrl: './resultados-instrumento.component.html',
  styleUrl: './resultados-instrumento.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ResultadosInstrumentoComponent implements OnInit {
  accordion = viewChild.required(MatAccordion);
  evaluacionSvc = inject(EvaluacionTrabajadorService);
  evaluacionId = input<number>(0, {alias: 'evaluacionId'})
  resultadoInstrumentoSignal = signal<DimensionData[]>([]);
  resultadoInstrumentoAbiertaSignal = signal<RespuestaAbiertaDTO[]>([]);

  ngOnInit(): void { 
    this.getInstrumentoResultado();
    this.getInstrumentoResultadoCualitativo();
  }

  async getInstrumentoResultado(){
    const data = await firstValueFrom(this.evaluacionSvc.getResultadoEvaluacion(this.evaluacionId()));

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

    async getInstrumentoResultadoCualitativo(){
      const data = await firstValueFrom(this.evaluacionSvc.GetResultadoEvaluacionCualitativa(this.evaluacionId()));
      if(data.data != null)
      {
        const datos = data.data;
        this.resultadoInstrumentoAbiertaSignal.set(datos);
      }
      }
}
