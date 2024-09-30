import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, input, NgZone, signal, type OnInit } from '@angular/core';
import { Dimension } from '@interfaces/dimension';
import { PersonaInfoDTO } from '@interfaces/DTOs/PersonaInfoDTO.interface';
import { Instrumento } from '@interfaces/instrumento';
import { EvaluacionTrabajadorService } from '@services/sed/EvaluacionTrabajador.service';
import { TitleComponent } from 'app/shared/title/title.component';

@Component({
  selector: 'app-aplicacion-evaluacion',
  standalone: true,
  imports: [
    CommonModule, TitleComponent
  ],
  templateUrl: './AplicacionEvaluacion.component.html',
  styleUrl: './AplicacionEvaluacion.component.css',
})
export default class AplicacionEvaluacionComponent implements AfterViewInit {
  evaluacionTrabajadorSvc = inject(EvaluacionTrabajadorService);
  id = input<number>(0, {alias: 'id'});
  EvaluadoSignal = signal({} as PersonaInfoDTO)
  InstrumentoSignal = signal({} as Instrumento)
  dateNow = signal(new Date());

  datos: Instrumento = {} as Instrumento;

  constructor(private zone: NgZone){}
  
   ngAfterViewInit(){
    this.getEvaluacionTrabajador()
   }

   getEvaluacionTrabajador(){
    this.evaluacionTrabajadorSvc.GetByIdEvaluado(this.id()).subscribe({
      next:(res)=>{
        const data = res.data!;
        this.EvaluadoSignal.set(data);
        this.getInstrumento(data);
      }
    })
   }

   getInstrumento(data: PersonaInfoDTO){
    this.evaluacionTrabajadorSvc.GetInstrumento(data.tipoTrabajador.id, 1).subscribe({
      next:(res)=>{
        const data = res.data;
        console.log(data);
        this.datos = data;
        this.InstrumentoSignal.set(data);
      }
    })
   }

}
