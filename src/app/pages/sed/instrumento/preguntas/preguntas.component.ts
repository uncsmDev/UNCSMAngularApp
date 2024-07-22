import { JsonPipe } from '@angular/common';
import { Component, inject, output, input, signal, Input, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EmiterResult } from '@interfaces/EmiterResult';
import { Dimension, DimensionView } from '@interfaces/dimension';
import { post } from '@interfaces/escala';
import { Instrumento, tipoModal } from '@interfaces/instrumento';
import { Pregunta } from '@interfaces/pregunta';
import { TipoPregunta } from '@interfaces/tipo_pregunta';
import { ModalService } from '@services/modal.service';
import { DimensionService } from '@services/sed/dimension.service';
import { InstrumentoService } from '@services/sed/instrumento.service';
import { PreguntaService } from '@services/sed/pregunta.service';
import { TipoPreguntaService } from '@services/sed/tipo-pregunta.service';
import { ModalDeleteComponent } from 'app/components/modal-delete/modal-delete.component';
import { ModalInterface } from 'flowbite';

@Component({
  selector: 'app-form-pregunta',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, ModalDeleteComponent],
  templateUrl: './preguntas.component.html',
  styleUrl: './preguntas.component.css'
})
export default class FormPreguntaComponent {
  fb = inject(FormBuilder);
  preguntaService = inject(PreguntaService);
  instrumentoService = inject(InstrumentoService);
  tipoPreguntaService = inject(TipoPreguntaService);
  dimensionService = inject(DimensionService);
  matSnackBar=inject(MatSnackBar);
  router = inject(Router);

  preguntaForm = this.fb.group({
    id: [0, [Validators.required]],
    nombre: ['', [Validators.required]],
    instrumentoId: [0, [Validators.required]],
    dimesionId: [0, [Validators.required]],
    tipoPreguntaId: [0, [Validators.required]]
  });
  i = 1;
  dimensiones = signal<Dimension[]>([]);
  tipoPregunta = signal<TipoPregunta[]>([]);
  instrumento = signal<Instrumento>({id: 0, nombre: '', tipoEntidadId: 0, tipoEvaluacionId: 0});
  
  typePost: post = 'post';

  instrumentoId = input<number>(0, {alias: 'id'})
  
  preguntas = signal<Pregunta[]>([]); 
  pregunta = signal<Pregunta>({id: 0, dimesionId: 0, instrumentoId:0, nombre: '', tipoPreguntaId: 0})
  
  modalDeleteComponent = viewChild.required(ModalDeleteComponent)

  ngOnInit() {
    this.getTipoPregunta();
    this.getDimension()
  }

  onSubmit(){
    if(this.preguntaForm.valid)
      {
        const pregunta: Pregunta = this.preguntaForm.value as Pregunta;
        pregunta.dimesionId = Number(pregunta.dimesionId);
        pregunta.instrumentoId = this.instrumentoId();
        pregunta.tipoPreguntaId = Number(pregunta.tipoPreguntaId);

        if(this.typePost == 'post'){
          this.preguntaService.post(pregunta).subscribe({
            next: a => {
              if(a)
                {
                  this.pregunta.set(a);
                // 
                this.dimensiones.update((prev) => {
                  return prev.map((c) => 
                    {
                      debugger
                      if(c.id ==  this.pregunta().dimesionId)
                        {
                          c.preguntas?.push(this.pregunta());
                        }
                      return c;
                    }
                  )
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
          debugger
          if(a)
            {
            this.dimensiones.update((prev) => {
              debugger
              return prev.map((c) => 
                {
                  debugger
                 c.preguntas = c.preguntas?.map((p) =>
                    {
                      return p.id === pregunta.id ? {...p,nombre:pregunta.nombre, dimesionId:pregunta.dimesionId, tipoPreguntaId:pregunta.tipoPreguntaId} : p
                    }
                  )
                return c;
                }
              )
            })
              this.getTipoPregunta();
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
  edit(pregunta: Pregunta)
  {
    
    this.preguntaForm.setValue(
      {
        id: pregunta.id,
        nombre: pregunta.nombre,
        dimesionId: pregunta.dimesionId,
        instrumentoId: pregunta.instrumentoId,
        tipoPreguntaId: pregunta.tipoPreguntaId
      }
    )
    this.typePost = 'update';
  }

  modelDelete(pregunta: Pregunta)
  {
    this.pregunta.set(pregunta);
    this.modalDeleteComponent().openModal();
  }

  delete(){
    this.preguntaService.delete(this.pregunta()).subscribe({
      next: (res) => {
        console.log(res);
       // this.get()
      }
    })
  }
  reset()
  {
    this.preguntaForm.reset(
      {
        id: 0,
        nombre: '',
        dimesionId: 0,
        instrumentoId: 0,
        tipoPreguntaId: 0
      }
    );
  }

  getTipoPregunta(){
    this.tipoPreguntaService.get().subscribe({
      next: (res) => {
        this.tipoPregunta.set(res);
      },
      error: (e) => {

      }
    })
  }
  getDimension(){
    this.dimensionService.getTE(this.instrumentoId()).subscribe({
      next: (res) => {
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
}
