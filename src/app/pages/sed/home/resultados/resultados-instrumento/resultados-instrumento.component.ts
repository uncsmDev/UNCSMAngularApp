import { Dimension } from '@interfaces/dimension';
import {ChangeDetectionStrategy, Component, inject, input, signal, viewChild, type OnInit} from '@angular/core';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import { EvaluacionTrabajadorResultadoDTO } from '@interfaces/DTOs/InstrumentoDTO.interface';
import { EvaluacionTrabajadorService } from '@services/sed/EvaluacionTrabajador.service';
import { TitleComponent } from 'app/shared/title/title.component';
import { first, firstValueFrom } from 'rxjs';

interface DimensionData 
{
  dimensionId: number, 
  dimension: string,
  preguntas: Pregunta[]
}

interface Pregunta{
  id: number,
  nombre: string,
  respuestaId: number;
  escalaId: number;
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

  ngOnInit(): void { 
    this.getInstrumentoResultado();
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
            preguntas: []
          }
          obj.push(existingDimension);
        }
  
        existingDimension.preguntas.push({
          id: pregunta.preguntaCerradaId,
          nombre: pregunta.preguntaCerradaNombre,
          respuestaId: pregunta.respuestaCerradaId,
          escalaId: pregunta.escalaId
        });
  
        return obj;
      }, [] as DimensionData[]);
  
      this.resultadoInstrumentoSignal.set(dimensiones);
    }
    }
}
