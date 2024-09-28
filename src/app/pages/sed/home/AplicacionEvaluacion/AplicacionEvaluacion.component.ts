import { CommonModule } from '@angular/common';
import { Component, inject, input, signal, type OnInit } from '@angular/core';
import { PersonaInfoDTO } from '@interfaces/DTOs/PersonaInfoDTO.interface';
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
export default class AplicacionEvaluacionComponent implements OnInit {
  evaluacionTrabajadorSvc = inject(EvaluacionTrabajadorService);
  id = input<number>(0, {alias: 'id'});
  EvaluadoSignal = signal({} as PersonaInfoDTO)
  ngOnInit(): void {
    this.getEvaluacionTrabajador()
   }

   getEvaluacionTrabajador(){
    this.evaluacionTrabajadorSvc.GetByIdEvaluado(this.id()).subscribe({
      next:(res)=>{
        this.EvaluadoSignal.set(res.data);
      }
    })
   }

}
