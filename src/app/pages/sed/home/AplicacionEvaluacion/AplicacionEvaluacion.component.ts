import { Result } from '@interfaces/Result.interface';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, inject, input, NgZone, QueryList, signal, viewChild, type OnInit } from '@angular/core';
import { PersonaInfoDTO } from '@interfaces/DTOs/PersonaInfoDTO.interface';
import { Escala } from '@interfaces/escala';
import { Instrumento } from '@interfaces/instrumento';
import { EscalaService } from '@services/sed/escala.service';
import { EvaluacionTrabajadorService } from '@services/sed/EvaluacionTrabajador.service';
import { TitleComponent } from 'app/shared/title/title.component';
import Swal from 'sweetalert2'
import {MatTabsModule} from '@angular/material/tabs';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepper, MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import { InstrumentoDTO } from '@interfaces/DTOs/InstrumentoDTO.interface';
import { EncabezadoComponent } from './encabezado/encabezado.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SweetalertService } from '@services/sweetalert.service';
import { EvaluacionTrabajador } from '@interfaces/EvaluacionTrabajador.interface';


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
    EncabezadoComponent,
    MatTabsModule
  ],
  templateUrl: './AplicacionEvaluacion.component.html',
  styleUrl: './AplicacionEvaluacion.component.css',
})
export default class AplicacionEvaluacionComponent implements AfterViewInit, OnInit {
  evaluacionTrabajadorSvc = inject(EvaluacionTrabajadorService);
  escalaServiceSvc = inject(EscalaService);
  id = input<number>(0, {alias: 'id'});
  EvaluadoSignal = signal({} as PersonaInfoDTO)
  evaluacionSignal = signal({} as EvaluacionTrabajador)
  InstrumentoSignal = signal({} as Result<InstrumentoDTO>)
  EscalasSignal = signal<Escala[]>([])
  dateNow = signal(new Date());
  matSnackBar=inject(MatSnackBar);
  sweetalert = inject(SweetalertService);
  stepperOrientation = signal<'horizontal' | 'vertical'>('horizontal');
  datos: Instrumento = {} as Instrumento;
 radioButtons = viewChild.required<QueryList<ElementRef>>('radioButton');

  isLinear = true;
  disableRipple = true;
  variable = true;
   ngAfterViewInit(){

    this.evaluacionTrabajadorSvc.getTipoEvaluacionHabilitada(this.id()).subscribe({
      next:(res)=>{
        if(res.data!= null){
          this.evaluacionSignal.set(res.data);
          if(res.data.evaluacionCuantitativaTerminada != null && res.data.evaluacionCuantitativaTerminada == true){

            this.getEvaluacionTrabajadorSinInstrumento();
          }else{
            this.getEvaluacionTrabajador()
            this.getEscala()
          }
        }else{
          this.getEvaluacionTrabajador()
          this.getEscala()
        }
      }
    })
   }
   
  selectRadio(itemId: number, preguntaId: number) {
    console.log(this.radioButtons());
    // Encontrar el radio button correcto basándose en el itemId
    const radioToSelect = this.radioButtons().find((radio) => {
      return radio.nativeElement.id === `radio-${itemId}-${preguntaId}`;
    });

    console.log(radioToSelect);

    if (radioToSelect && !radioToSelect.nativeElement.checked) {
      radioToSelect.nativeElement.checked = true;
      radioToSelect.nativeElement.dispatchEvent(new Event('change')); // Disparar evento 'change' manualmente
    }
  }

   
   ngOnInit(): void {
    this.setStepperOrientation(window.innerWidth);
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

   getEvaluacionTrabajadorSinInstrumento(){
    this.evaluacionTrabajadorSvc.GetByIdEvaluado(this.id()).subscribe({
      next:(res)=>{
        const data = res.data!;
        this.EvaluadoSignal.set(data);
      }
   })
   }

   getInstrumento(data: PersonaInfoDTO){
    this.evaluacionTrabajadorSvc.GetInstrumento(data.tipoTrabajador.id, 1, this.id()).subscribe({
      next:(res)=>{
        if(res.data!= null)
        {
          
          const data = res.data;
          this.InstrumentoSignal.set(res);
        }
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
            /* this.matSnackBar.open("", 'Cerrar', {
              duration: 5000,
              horizontalPosition: 'center'
            });*/

           
    Swal.fire({
      title: 'Error!',
      text: 'Debe contestar todas las preguntas antes de continuar',
      icon: 'error',
      confirmButtonText: 'Ok',
      ...this.sweetalert.theme,
    })
        }
      }
    })
  }
  

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.setStepperOrientation(event.target.innerWidth);
  }

  private setStepperOrientation(width: number): void {
    if (width <= 768) {
      this.stepperOrientation.set('vertical');
    } else {
      this.stepperOrientation.set('horizontal');
    }
  }

  finishEvaluacionCuantitativa(){
   
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
