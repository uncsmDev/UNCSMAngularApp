import { JsonPipe, LowerCasePipe } from '@angular/common';
import { Component, inject, input, signal, Input, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { post } from '@interfaces/escala';
import { Instrumento } from '@interfaces/instrumento';
import { PreguntaAbierta } from '@interfaces/pregunta_abierta';
import { PreguntasCerradas } from '@interfaces/pregunta_cerradas';
import { TipoEntidad } from '@interfaces/tipoEntidad';
import { InstrumentoService } from '@services/sed/instrumento.service';
import { PreguntaAbiertaService } from '@services/sed/preguntaAbierta.service';
import { ModalDeleteComponent } from 'app/components/modal-delete/modal-delete.component';

@Component({
  selector: 'app-preguntas-abiertas',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, ModalDeleteComponent, LowerCasePipe],
  templateUrl: './preguntas-abiertas.component.html',
  styleUrl: './preguntas-abiertas.component.css'
})
export default class PreguntasAbiertasComponent {
  fb = inject(FormBuilder);
  preguntaService = inject(PreguntaAbiertaService);
  instrumentoService = inject(InstrumentoService);
  matSnackBar=inject(MatSnackBar);
  router = inject(Router);

  preguntaForm = this.fb.group({
    id: [0, [Validators.required]],
    nombre: ['', [Validators.required]]
  });

  tipoPreguntaBAND = signal(false);

  tipoEntidad = signal<TipoEntidad>({id: 0, nombre: ""});
  
  typePost: post = 'post';

  instrumentoId = input<number>(0, {alias: 'id'})
  
  preguntas = signal<PreguntaAbierta[]>([]); 
  pregunta = signal<PreguntaAbierta>({id: 0, nombre: '', instrumentoId: 0})
  
  modalDeleteComponent = viewChild.required(ModalDeleteComponent)

  ngOnInit() {
    this.getPreguntaAbierta();
    this.getInstrumento()
  }

  onSubmit(){
    if(this.preguntaForm.valid)
      {
        const pregunta: PreguntaAbierta = this.preguntaForm.value as PreguntaAbierta;
        pregunta.instrumentoId = this.instrumentoId();

        if(this.typePost == 'post'){
          this.preguntaService.post(pregunta).subscribe({
            next: a => {
              if(a.data != null)
                {
                  const data = a.data!;
                  if(this.preguntas.length > 0)
                  {
                    this.preguntas.update((p) => [...p, {id: data.id, nombre: data.nombre, instrumentoId: data.instrumentoId}]);
                  }else{
                    this.preguntas.set([{id: data.id, nombre: data.nombre, instrumentoId: data.instrumentoId}]);
                  }
                  
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
              const data = a.data!;
              this.preguntas.update((p) => {
                return p.map(c => c.id == data.id ? {...c, nombre: data.nombre} : c
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
  edit(pregunta: PreguntaAbierta)
  {
    this.preguntaForm.setValue(
      {
        id: pregunta.id,
        nombre: pregunta.nombre
      }
    )
    this.typePost = 'update';
  }

  modelDelete(pregunta: PreguntaAbierta)
  {
    this.pregunta.set(pregunta);
    this.modalDeleteComponent().openModal();
  }

  delete(){
    this.preguntaService.delete(this.pregunta()).subscribe({
      next: (res) => {
        this.preguntas.update((p) => p.filter(filtro => filtro.id != this.pregunta().id));
        this.matSnackBar.open("Dato eliminado correctamente",'Cerrar',{ duration:5000, horizontalPosition:'center'});
      }
    })
  }
  reset()
  {
    this.preguntaForm.reset(
      {
        id: 0,
        nombre: ''
      }
    );
  }

  getPreguntaAbierta()
  {
    this.preguntaService.get(this.instrumentoId()).subscribe({
      next: (preguntas_abiertas) => {
        this.preguntas.set(preguntas_abiertas.data!);
      }
    })
  }

  getInstrumento(){
    this.preguntaService.getInstrumento(this.instrumentoId()).subscribe({
      next: (instrumento) => {
        this.tipoEntidad.set(instrumento.data!);
      }
    })
  }
}
