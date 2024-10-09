import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, input, NgZone, signal, type OnInit } from '@angular/core';
import { PersonaInfoDTO } from '@interfaces/DTOs/PersonaInfoDTO.interface';
import { Escala } from '@interfaces/escala';
import { Instrumento } from '@interfaces/instrumento';
import { EscalaService } from '@services/sed/escala.service';
import { EvaluacionTrabajadorService } from '@services/sed/EvaluacionTrabajador.service';
import { TitleComponent } from 'app/shared/title/title.component';


import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepper, MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-aplicacion-evaluacion',
  standalone: true,
  imports: [
    CommonModule, TitleComponent, MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './AplicacionEvaluacion.component.html',
  styleUrl: './AplicacionEvaluacion.component.css',
})
export default class AplicacionEvaluacionComponent implements AfterViewInit {
  evaluacionTrabajadorSvc = inject(EvaluacionTrabajadorService);
  escalaServiceSvc = inject(EscalaService);
  id = input<number>(0, {alias: 'id'});
  EvaluadoSignal = signal({} as PersonaInfoDTO)
  InstrumentoSignal = signal({} as Instrumento)
  EscalasSignal = signal<Escala[]>([])
  dateNow = signal(new Date());

  datos: Instrumento = {} as Instrumento;

  isLinear = true;
  
   ngAfterViewInit(){
    this.getEvaluacionTrabajador()
    this.getEscala()
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
    this.evaluacionTrabajadorSvc.GetInstrumento(data.tipoTrabajador.id, 1, this.id()).subscribe({
      next:(res)=>{
        const data = res.data;
        console.log(data)
        this.datos = data;
        this.InstrumentoSignal.set(data);
      }
    });
   }

   customNext(stepper: MatStepper) {
    // Ejemplo:
    if (true) {
      stepper.next(); // Avanza al siguiente paso
    } else {
      alert('No se puede avanzar, complete todos los campos');
    }
  }

   getEscala(){
    this.escalaServiceSvc.get().subscribe({
      next:(res)=>{
        const data = res;
        this.EscalasSignal.set(data);
      }
    })
   }

   saveEscala(idRespuesta: number, idEscala: number){

    console.log(idRespuesta, idEscala);
   }

}
