import { JsonPipe } from '@angular/common';
import { Component, inject, output, input, signal, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmiterResult } from '@interfaces/EmiterResult';
import { Dimension } from '@interfaces/dimension';
import { Instrumento, tipoModal } from '@interfaces/instrumento';
import { Pregunta } from '@interfaces/pregunta';
import { TipoPregunta } from '@interfaces/tipo_pregunta';
import { ModalService } from '@services/modal.service';
import { DimensionService } from '@services/sed/dimension.service';
import { PreguntaService } from '@services/sed/pregunta.service';
import { TipoPreguntaService } from '@services/sed/tipo-pregunta.service';
import { ModalInterface } from 'flowbite';

@Component({
  selector: 'app-form-pregunta',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './form-pregunta.component.html',
  styleUrl: './form-pregunta.component.css'
})
export default class ModalPreguntaComponent {
  modalActivo!: ModalInterface;
  fb = inject(FormBuilder);
  preguntaService = inject(PreguntaService);
  tipoPreguntaService = inject(TipoPreguntaService);
  dimensionService = inject(DimensionService);
  matSnackBar=inject(MatSnackBar);

  preguntaForm = this.fb.group({
    id: [0, [Validators.required]],
    nombre: ['', [Validators.required]],
    instrumentoId: [0, [Validators.required]],
    dimesionId: [0, [Validators.required]],
    tipoPreguntaId: [0, [Validators.required]]
  });

  outputPostType = output<EmiterResult<Pregunta>>();
  dimensiones = signal<Dimension[]>([]);
  tipoPregunta = signal<TipoPregunta[]>([]);
  instrumento = input<Instrumento|null>();
  @Input() id!: number;
  
  preguntas = signal<Pregunta[]>([]); 
  ngOnInit() {
    this.get();
    this.getTipoPregunta();
    this.getDimension();
  }

  onSubmit(){
    if(this.preguntaForm.valid)
      {
        const pregunta: Pregunta = this.preguntaForm.value as Pregunta;
        pregunta.dimesionId = Number(pregunta.dimesionId);
        pregunta.instrumentoId = this.instrumento()!.id;
        pregunta.tipoPreguntaId = Number(pregunta.tipoPreguntaId);
    
   
      this.preguntaService.post(pregunta).subscribe({
        next: a => {
         debugger
          if(a)
            {
             // this.reset()
              this.preguntas.update((prev) => {
                return [...prev, {...pregunta, id: a}]
              })
              
              //this.tipoEntidades();
              this.getTipoPregunta();
              this.matSnackBar.open("Dato guardado correctamente",'Cerrar',{ duration:5000, horizontalPosition:'center'});
            }
            else{
              this.matSnackBar.open("Error al intentar guardar el dato",'Cerrar',{ duration:5000, horizontalPosition:'center'});
            }
          
        },
        error: (e) => {
         debugger
          this.matSnackBar.open("Error al intentar guardar el dato ",'Cerrar',{ duration:5000, horizontalPosition:'center'});
          console.log(e);
        }
      });
  }
  else{
  }
  
}

get(){
  this.preguntaService.get(this.id).subscribe({
    next: (res) => {
      this.preguntas.set(res);
      console.log(this.preguntas());
    },
    error: (e) => {

    }
  })
}

  resetPregunta()
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
    this.dimensionService.get().subscribe({
      next: (res) => {
        this.dimensiones.set(res);
      }
    })
  }
}
