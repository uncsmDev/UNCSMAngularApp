import { JsonPipe, Location, LowerCasePipe } from '@angular/common';
import { Component, inject, input, signal, Input, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Dimension} from '@interfaces/dimension';
import { post } from '@interfaces/escala';
import { Instrumento } from '@interfaces/instrumento';
import { PreguntasCerradas } from '@interfaces/pregunta_cerradas';
import { TipoEntidad, TipoTrabajador } from '@interfaces/tipoEntidad';
import { DimensionService } from '@services/sed/dimension.service';
import { InstrumentoService } from '@services/sed/instrumento.service';
import { PreguntaService } from '@services/sed/pregunta.service';
import { ModalDeleteComponent } from 'app/components/modal-delete/modal-delete.component';
import { TitleComponent } from 'app/shared/title/title.component';

@Component({
  selector: 'app-form-pregunta',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, ModalDeleteComponent, LowerCasePipe, TitleComponent],
  templateUrl: './preguntas.component.html',
  styleUrl: './preguntas.component.css'
})
export default class FormPreguntaComponent {
  fb = inject(FormBuilder);
  preguntaService = inject(PreguntaService);
  instrumentoService = inject(InstrumentoService);
  dimensionService = inject(DimensionService);
  matSnackBar=inject(MatSnackBar);
  router = inject(Router);
  location = inject(Location);
  preguntaForm = this.fb.group({
    id: [0, [Validators.required]],
    nombre: ['', [Validators.required]],
  });

  tipoPreguntaBAND = signal(false);

  i = 1;
  dimensiones = signal<Dimension>({} as Dimension);
  instrumento = signal<Instrumento>({id: 0, nombre: '', tipoTrabajadorId: 0, tipoEvaluacionId: 0});
  
  typePost: post = 'post';

  instrumentoId = input<number>(0, {alias: 'id'})
  
  
  pregunta = signal<PreguntasCerradas>({id: 0, dimesionId: 0, nombre: ''})
  
  modalDeleteComponent = viewChild.required(ModalDeleteComponent)

  ngOnInit() {
    this.getDimension()
    this.getInstrumento()
  }

  onSubmit(){
    if(this.preguntaForm.valid)
      {
        const pregunta: PreguntasCerradas = this.preguntaForm.value as PreguntasCerradas;
        pregunta.dimesionId = Number(this.instrumentoId());
        if(this.typePost == 'post'){
          this.preguntaService.post(pregunta).subscribe({
            next: a => {
              if(a)
                {
                  this.pregunta.set(a);
                // 
                this.dimensiones.update((prev) => {
                  return {
                    ...prev,
                    preguntasCerradas: [...prev.preguntasCerradas!, a]
                  }
                })
                  this.matSnackBar.open("Dato guardado correctamente",'Cerrar',{ duration:5000, horizontalPosition:'center'});
                }
                else{
                  this.matSnackBar.open("Error al intentar guardar el dato",'Cerrar',{ duration:5000, horizontalPosition:'center'});
                }
              
            },
            error: (e) => {
              this.matSnackBar.open("Error al intentar guardar el dato ",'Cerrar',{ duration:5000, horizontalPosition:'center'});
              console.log(e);
            }
          });
    }
    else{
      this.preguntaService.update(pregunta).subscribe({
        next: a => {
          if(a)
            {
              this.getDimension()
              this.matSnackBar.open("Dato guardado correctamente",'Cerrar',{ duration:5000, horizontalPosition:'center'});
            }
            else{
              this.matSnackBar.open("Error al intentar guardar el dato",'Cerrar',{ duration:5000, horizontalPosition:'center'});
            }
          
        },
        error: (e) => {
          this.matSnackBar.open("Error al intentar guardar el dato ",'Cerrar',{ duration:5000, horizontalPosition:'center'});
        }
      });
      this.typePost = 'post'
    }
    this.reset();
  }
  else{
  }
  
}
 
  save(){
    this.typePost = 'post';
  }
  edit(pregunta: PreguntasCerradas)
  {
    this.preguntaForm.setValue(
      {
        id: pregunta.id,
        nombre: pregunta.nombre,
      }
    )
    this.typePost = 'update';
  }

  modelDelete(pregunta: PreguntasCerradas)
  {
    this.pregunta.set(pregunta);
    this.modalDeleteComponent().openModal();
  }

  delete(){
    this.preguntaService.delete(this.pregunta()).subscribe({
      next: (res) => {
        this.getDimension()
        this.matSnackBar.open("Dato eliminado correctamente",'Cerrar',{ duration:5000, horizontalPosition:'center'});
      }
    })
  }
  reset()
  {
    this.preguntaForm.reset(
      {
        id: 0,
        nombre: '',
      }
    );
  }

  getDimension(){
    this.dimensionService.getTE(this.instrumentoId()).subscribe({
      next: (res) => {
        console.log(res);
        this.dimensiones.set(res);
      }
    })
  }
  increment(value: number){
    this.i += value;
  }
  resetIncrement()
  {
    this.i = 1;
  }
  tipoTrabajador = signal<TipoTrabajador>({id: 0, nombre: "", icono: null});
  getInstrumento(){
    this.preguntaService.getInstrumento(this.instrumentoId()).subscribe({
      next: (instrumento) => {
        this.tipoTrabajador.set(instrumento.data!);
      }
    })
  }

  back(){
    this.location.back()
  }
}
