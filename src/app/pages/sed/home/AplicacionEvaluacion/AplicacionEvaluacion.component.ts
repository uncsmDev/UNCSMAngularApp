import { map } from 'rxjs';
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
import { InstrumentoDTO } from '@interfaces/DTOs/InstrumentoDTO.interface';
import { EncabezadoComponent } from './encabezado/encabezado.component';
import { MatSnackBar } from '@angular/material/snack-bar';


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
    EncabezadoComponent
  ],
  templateUrl: './AplicacionEvaluacion.component.html',
  styleUrl: './AplicacionEvaluacion.component.css',
})
export default class AplicacionEvaluacionComponent implements AfterViewInit {
  evaluacionTrabajadorSvc = inject(EvaluacionTrabajadorService);
  escalaServiceSvc = inject(EscalaService);
  id = input<number>(0, {alias: 'id'});
  EvaluadoSignal = signal({} as PersonaInfoDTO)
  InstrumentoSignal = signal({} as InstrumentoDTO)
  EscalasSignal = signal<Escala[]>([])
  dateNow = signal(new Date());
  matSnackBar=inject(MatSnackBar);

  datos: Instrumento = {} as Instrumento;

  isLinear = true;
  disableRipple = true;
  
   ngAfterViewInit(){
    this.getEvaluacionTrabajador()
    this.getEscala()

    const stepHeaders = document.querySelectorAll('.mat-step-header');
    stepHeaders.forEach(header => {
      header.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation(); // Previene la navegación por clic en los encabezados
      });
    });
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
        this.InstrumentoSignal.set(data);
      }
    });
   }

   customNext(stepper: MatStepper, DimensionId: number) {
    this.evaluacionTrabajadorSvc.GetNextStep(DimensionId, this.id()).subscribe({
      next:(res)=>{
        if (res.data) {
          stepper.selected!.completed = true;
          stepper.next();
        
        } else {
         
            this.matSnackBar.open("Debe contestar todas las preguntas antes de continuar", 'Cerrar', {
              duration: 5000,
              horizontalPosition: 'center'
            });
        }
      }
    })
  }

  handleChange(event: Event, idRespuesta: number, idEscala: number) {
    const selectElement = event.target as HTMLInputElement;
    console.log(selectElement.checked, idRespuesta, idEscala);
    this.evaluacionTrabajadorSvc.updateEscala(idRespuesta, idEscala).subscribe({
      next:(res)=>{
        console.log(res);
      }
    })
  }


   getEscala(){
    this.escalaServiceSvc.get().subscribe({
      next:(res)=>{
        const data = res;
        this.EscalasSignal.set(data);
      }
    })
   }

}
