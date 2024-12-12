import { Result } from '@interfaces/Result.interface';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, HostListener, inject, input, signal, Signal } from '@angular/core';
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
import { EvaluacionTrabajadorDTO, InstrumentoAbiertoDTO } from '@interfaces/DTOs/InstrumentoDTO.interface';
import { EncabezadoComponent } from './encabezado/encabezado.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SweetalertService } from '@services/sweetalert.service';
import { RespuestaDTO } from '@interfaces/DTOs/respuesta.interface';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { TokenData } from '@interfaces/acount';
import { EvaluacionTrabajador } from '@interfaces/EvaluacionTrabajador.interface';


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

interface DimensionData 
{
  dimensionId: number, 
  dimension: string,
  preguntas: Pregunta[]
}

interface DimensionData1
{
  dimensionId: number, 
  dimension: string,
}

interface Pregunta{
  id: number,
  nombre: string,
  respuestaId: number;
  escalaId: number;
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

  EvaluadoSignal = signal({} as IEvaluadoDataProcedureDTO)
  InstrumentoSignal = signal({} as Result<EvaluacionTrabajadorDTO[]>)
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
  dataUpdate = signal<EvaluacionEscala[]>([]);

  nextStepCount = signal<DimensionesCount[]>([]);
  dimensiones = signal<DimensionData[]>([]);

   ngAfterViewInit(){
    this.iniciarEvaluacion();
   }

   iniciarEvaluacion(){
    this.getEvaluacionTrabajador()
    this.getEscala()
   }
 
   ngOnInit(): void {
    this.setStepperOrientation(window.innerWidth);
   }
  
   getEvaluacionTrabajador(){
    const res = JSON.parse(sessionStorage.getItem('loggedInUser')!);
    const decodedToken:TokenData = jwtDecode(res.token);
    this.evaluacionTrabajadorSvc.GetByIdEvaluado(this.evaluadoId(), decodedToken.nameid).subscribe({
      next:(res)=>{
        if(res.data != null)
        {
          const data = res.data!;
          if(res.data.evaluacionCuantitativaTerminada != null && res.data.evaluacionCuantitativaTerminada == true && res.data.evaluacionCualitativaTerminada != null && res.data.evaluacionCualitativaTerminada == true)  
          {
            this.router.navigate(['sed/personal']);
          }
        
          this.EvaluadoSignal.set(data);
          this.evaluacionTrabajadorSvc.updateInicioEvaluacion(this.evaluadoId()).subscribe();

          if(res.data.evaluacionCuantitativaTerminada != null && res.data.evaluacionCuantitativaTerminada == true){
            this.getEvaluacionTrabajadorCualitativo();
          }
          else{
            this.getInstrumento(data);
          }
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

   getEvaluacionTrabajadorCualitativo(){
    const res = JSON.parse(sessionStorage.getItem('loggedInUser')!);
    const decodedToken:TokenData = jwtDecode(res.token);
    this.evaluacionTrabajadorSvc.GetByIdEvaluado(this.evaluadoId(), decodedToken.nameid).subscribe({
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
    this.evaluacionTrabajadorSvc.GetInstrumento(this.evaluadoId()).subscribe({
      next:(res)=>{
        if(res.data!= null)
        {
          this.nextStepCount.set(
            res.data.map(
              d => (
                { 
                  dimensionId: d.dimensionId,
                  dimension: d.dimensionNombre, 
                  preguntaId: res.data
                  .filter(p => p.dimensionId === d.dimensionId) // Filtrar correctamente
                  .map(p => ({
                      id: p.preguntaCerradaId,
                      valor: false,
                  }))
                }
          )));

          this.dimensiones.set(res.data.reduce((obj: DimensionData[], dimension) => {
            let existingDimension = obj.find(d => d.dimensionId === dimension.dimensionId);
            if (!existingDimension) {
              existingDimension = { 
                dimensionId: dimension.dimensionId, 
                dimension: dimension.dimensionNombre, 
                preguntas: [] 
              };
              obj.push(existingDimension);
            };
            

            existingDimension.preguntas.push({
              id: dimension.preguntaCerradaId,
              nombre: dimension.preguntaCerradaNombre,
              respuestaId: dimension.respuestaCerradaId,
              escalaId: dimension.escalaId
            });
        
            return obj;
          }, [] as DimensionData[]));  
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
              this.EvaluadoSignal.update(p => ({...p, evaluacionCuantitativaTerminada: true}));
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
        this.router.navigate(['sed/home']);
      }
    });
  }

  

  handleChange(event: Event, preguntaId: number, idEscala: number, dimensionId: number, respuestaCerradaId: number) {
    const selectElement = event.target as HTMLInputElement;

    if (selectElement.type !== 'radio') {
      Swal.fire({
            title: 'Error!',
            text: 'Elemento de entrada no valido',
            icon: 'error',
            confirmButtonText: 'Ok',
            ...this.sweetalert.theme,
          })
      selectElement.checked = false;
      return; // Evita realizar la acción
    }

    this.dataUpdate().length == 0 
    ? 
    
    this.dataUpdate.set([{
      escalaId: idEscala,
      EvaluacionId: respuestaCerradaId
    }]):this.dataUpdate.update((current) => {
      const dataSearch = this.dataUpdate().some(d => d.EvaluacionId == respuestaCerradaId) 
      ? 
      current.map((d) => {
        if(d.EvaluacionId == respuestaCerradaId){
          return {...d, 
            escalaId: idEscala
            }
          }else{
            return d;
          }
        })
      : 
      [...current, {
        escalaId: idEscala,
        EvaluacionId: respuestaCerradaId
      }]
      return dataSearch;
    })

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
      if(this.respuestaAbiertaSignal().length > 0)
      {
        if(this.respuestaAbiertaSignal().find((dato) => {
          return dato.id == Number(textArea.id);
        }) == undefined){
          this.respuestaAbiertaSignal().push({id: Number(textArea.id), respuesta: textArea.value});
        }
      }else{
        this.respuestaAbiertaSignal().push({id: Number(textArea.id), respuesta: textArea.value});
      }
    });

    this.evaluacionTrabajadorSvc.updateRespuestaAbierta(this.respuestaAbiertaSignal()).subscribe({
      next:(res)=>{
        if(res.data){
          Swal.fire({
            title: 'Evaluación guardada con éxito',
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
