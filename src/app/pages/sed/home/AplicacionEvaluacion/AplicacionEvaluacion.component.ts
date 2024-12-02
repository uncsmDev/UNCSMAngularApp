import { Result } from '@interfaces/Result.interface';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, inject, input, signal, Signal } from '@angular/core';
import { IEvaluadoDataProcedureDTO, PersonaInfoDTO } from '@interfaces/DTOs/PersonaInfoDTO.interface';
import { Escala } from '@interfaces/escala';
import { Instrumento } from '@interfaces/instrumento';
import { EscalaService } from 'app/pages/sed/escala/escala.service';
import { EvaluacionTrabajadorService } from '@services/sed/EvaluacionTrabajador.service';
import { TitleComponent } from 'app/shared/title/title.component';
import Swal from 'sweetalert2'
import {MatTabsModule} from '@angular/material/tabs';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepper, MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import { InstrumentoAbiertoDTO, InstrumentoDTO } from '@interfaces/DTOs/InstrumentoDTO.interface';
import { EncabezadoComponent } from './encabezado/encabezado.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SweetalertService } from '@services/sweetalert.service';
import { EvaluacionTrabajador } from '@interfaces/EvaluacionTrabajador.interface';
import { RespuestaDTO } from '@interfaces/DTOs/respuesta.interface';
import { Router } from '@angular/router';


export interface EvaluacionEscala{
  EvaluacionId: number
  escalaId: number
}

export interface DimensionesCount{
  dimensionId: number
  dimension: string
  preguntaId: preguntaValor[]
}

interface preguntaValor {
  id: number,
  valor: boolean
}

@Component({
    selector: 'app-aplicacion-evaluacion',
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
    styleUrl: './AplicacionEvaluacion.component.css'
})
export default class AplicacionEvaluacionComponent implements AfterViewInit {
  evaluacionTrabajadorSvc = inject(EvaluacionTrabajadorService);
  escalaServiceSvc = inject(EscalaService);

  evaluadoId = input<number>(0, {alias: 'evaluacionId'});
  contratoId = input<number>(0, {alias: 'contratoId'});

  EvaluadoSignal = signal({} as IEvaluadoDataProcedureDTO)
  evaluacionSignal = signal({} as EvaluacionTrabajador)
  InstrumentoSignal = signal({} as Result<InstrumentoDTO>)
  InstrumentoAbiertaSignal = signal({} as Result<InstrumentoAbiertoDTO>)
  EscalasSignal = signal<Escala[]>([])
  dateNow = signal(new Date());
  matSnackBar=inject(MatSnackBar);
  sweetalert = inject(SweetalertService);
  stepperOrientation = signal<'horizontal' | 'vertical'>('horizontal');
  datos: Instrumento = {} as Instrumento;
  respuestaAbiertaSignal = signal<RespuestaDTO[]>([]);
  isLinear = true;
  disableRipple = true;
  variable = true;
  router = inject(Router);


  nextStepCount = signal<DimensionesCount[]>([]);
  
   ngAfterViewInit(){
    this.iniciarEvaluacion();
   }

   iniciarEvaluacion(){
    this.evaluacionTrabajadorSvc.getTipoEvaluacionHabilitada(this.evaluadoId()).subscribe({
      next:(res)=>{
        if(res.data!= null){

          this.evaluacionSignal.set(res.data);

          if(res.data.evaluacionCuantitativaTerminada != null && res.data.evaluacionCuantitativaTerminada == true && res.data.evaluacionCualitativaTerminada != null && res.data.evaluacionCualitativaTerminada == true)  
          {
            this.router.navigate(['sed/home']);
          }
          if(res.data.evaluacionCuantitativaTerminada != null && res.data.evaluacionCuantitativaTerminada == true){
            this.getEvaluacionTrabajadorSinInstrumento();
            this.InstrumentoSignal.set({} as Result<InstrumentoDTO>);
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
 
   ngOnInit(): void {
    this.setStepperOrientation(window.innerWidth);
   }
  
   getEvaluacionTrabajador(){
    this.evaluacionTrabajadorSvc.GetByIdEvaluado(this.evaluadoId(), this.contratoId()).subscribe({
      next:(res)=>{
        if(res.data != null)
        {
          const data = res.data!;
        
          this.EvaluadoSignal.set(data);
          this.evaluacionTrabajadorSvc.updateInicioEvaluacion(this.evaluadoId()).subscribe();
          this.getInstrumento(data);
        }
        else{
          Swal.fire({
            title: 'Error!',
            text: 'No fue posible encontrar el registro del trabajador',
            icon: 'error',
            confirmButtonText: 'Ok',
            ...this.sweetalert.theme,
          })
          this.router.navigate(['sed/home']);
        }
       
      }
   })
   }

   getEvaluacionTrabajadorSinInstrumento(){
    this.evaluacionTrabajadorSvc.GetByIdEvaluado(this.evaluadoId(), this.contratoId()).subscribe({
      next:(res)=>{
        if(res.data != null)
        {
          const data = res.data!;
          this.EvaluadoSignal.set(data);
          this.getInstrumentoCualitativo(data);
        }else
        {
          Swal.fire({
            title: 'Error!',
            html: '<p>No fue posible encontrar un instrumento asociado, por favor contacte con la <strong>Coordinación de Sistemas</strong>.</p>',
            icon: 'error',
            confirmButtonText: 'Ok',
            ...this.sweetalert.theme,
          })
          this.router.navigate(['sed/home']);
        }
       
      }
   })
   }

   getInstrumento(data: IEvaluadoDataProcedureDTO){
    this.evaluacionTrabajadorSvc.GetInstrumento(data.tipoTrabajadorId, 1, this.evaluadoId()).subscribe({
      next:(res)=>{
        if(res.data!= null)
        {
          this.nextStepCount.set(res.data.dimensiones.map(d => (
            { dimensionId: d.id, dimension: d.nombre, preguntaId: d.preguntasCerradas.map(p => ({ id: p.id, valor: false }))
            })));
          this.InstrumentoSignal.set(res);
        }else
        {
          Swal.fire({
            title: 'Error!',
            html: '<p>No fue posible encontrar un instrumento asociado, por favor contacte con la <strong>Coordinación de Sistemas</strong>.</p>',
            icon: 'error',
            confirmButtonText: 'Ok',
            ...this.sweetalert.theme,
          })
          this.router.navigate(['sed/home']);
        }
      }
    });
   }

   getInstrumentoCualitativo(data: IEvaluadoDataProcedureDTO){
    this.evaluacionTrabajadorSvc.GetInstrumentoCualitativo(data.tipoTrabajadorId, 1, this.evaluadoId()).subscribe({
      next:(res)=>{
        if(res.data!= null)
        {
          this.InstrumentoAbiertaSignal.set(res);
        }
        else{
          Swal.fire({
            title: 'Error!',
            html: '<p>No fue posible encontrar la segunda parte del instrumento, por favor contacte con la <strong>Coordinación de Sistemas</strong>.</p>',
            icon: 'error',
            confirmButtonText: 'Ok',
            ...this.sweetalert.theme,
          })
          this.router.navigate(['sed/home']);
        }
      }
    });
   }

   count = signal(0);

   customNext(stepper: MatStepper, DimensionId: number) {
    const resultado = this.nextStepCount().find(d => d.dimensionId == DimensionId)?.preguntaId.every(p => p.valor == true);

    if(resultado){
      stepper.selected!.completed = true;
      stepper.next();
      this.count.set(0);
    }
    else {           
      Swal.fire({
        title: 'Error!',
        text: 'Debe contestar todas las preguntas antes de continuar',
        icon: 'error',
        confirmButtonText: 'Ok',
        ...this.sweetalert.theme,
      })
    }
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
    this.evaluacionTrabajadorSvc.updateEscala(this.dataUpdate()).subscribe({
      next :(res)=>{
        if(res.data != null && res.data == true){
          this.evaluacionTrabajadorSvc.updateFinishEvaluacionCuantitativa(this.evaluadoId()).subscribe({
            next:(res)=>{
              this.iniciarEvaluacion();
            }
          })
        }
        else{
          Swal.fire({
            title: 'Error!',
            text: 'No se guardaron las respuestas, contacte con el administrador',
            icon: 'error',
            confirmButtonText: 'Ok',
            ...this.sweetalert.theme,
          })
        }
      }
    });
    
  }

  finishEvaluacionCualitativa(){
    this.evaluacionTrabajadorSvc.UpdateFinishEvaluacionCualitativa(this.evaluadoId()).subscribe({
      next:(res)=>{
        this.evaluacionSignal.update((datos) => {
          return {...datos, evaluacionCualitativaTerminada:true };
        });          
        this.respuestaAbiertaSignal.set([]);
        this.router.navigate(['sed/home']);
      }
    });
  }

  dataUpdate = signal<EvaluacionEscala[]>([]);

  handleChange(event: Event, preguntaId: number, idEscala: number, dimensionId: number) {
    const selectElement = event.target as HTMLInputElement;
    this.nextStepCount.update((current) => {
      return current.map((d) => {
        if(d.dimensionId == dimensionId){
          return {...d, 
            preguntaId: d.preguntaId.map((p) => {
              if(p.id == preguntaId){
                return {...p, valor: true};
              }
              else{
                return p;
              }
            })
          };
        }
        else{
          return d;
        }
      })
   });

  }


   getEscala(){
    this.escalaServiceSvc.get().subscribe({
      next:(res)=>{
        const data = res;
        this.EscalasSignal.set(data);
      }
    })
   }

   guardarRespuesta(){
    const textAreas = document.getElementsByClassName('textareasresponse') as HTMLCollectionOf<HTMLTextAreaElement>;
    Array.from(textAreas).forEach(textArea => {
      this.respuestaAbiertaSignal().push({id: Number(textArea.id), respuesta: textArea.value});
    });

    this.evaluacionTrabajadorSvc.updateRespuestaAbierta(this.respuestaAbiertaSignal()).subscribe({
      next:(res)=>{
        if(res.data){
          Swal.fire({
            title: 'Instrumento guardado con éxito',
            icon: 'success',
            confirmButtonText: 'Ok',
            ...this.sweetalert.theme,
          })
          this.finishEvaluacionCualitativa();
        }
        else{
          Swal.fire({
            title: 'Error!',
            text: 'Hubo un error al momento de guardar las respuestas',
            icon: 'error',
            confirmButtonText: 'Ok',
            ...this.sweetalert.theme,
          })
        }
        
      }
    });
   }

}
