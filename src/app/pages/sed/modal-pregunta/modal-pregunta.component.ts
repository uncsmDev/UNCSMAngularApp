import { Component, inject, output, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmiterResult } from '@interfaces/EmiterResult';
import { Dimension } from '@interfaces/dimension';
import { Instrumento, tipoModal } from '@interfaces/instrumento';
import { Pregunta } from '@interfaces/pregunta';
import { TipoPregunta } from '@interfaces/tipo_pregunta';
import { ModalService } from '@services/modal.service';
import { ModalInterface } from 'flowbite';

@Component({
  selector: 'app-modal-pregunta',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './modal-pregunta.component.html',
  styleUrl: './modal-pregunta.component.css'
})
export class ModalPreguntaComponent {
  modalActivo!: ModalInterface;
  fb = inject(FormBuilder);
  modalService = inject(ModalService);

  preguntaForm = this.fb.group({
    id: [0, [Validators.required]],
    nombre: ['', [Validators.required]],
    instrumentoId: [0, [Validators.required]],
    dimesionId: [0, [Validators.required]],
    tipoPreguntaId: [0, [Validators.required]]
  });

  PostType = input.required<tipoModal>();
  text:string = 'Agregar';

  outputPostType = output<EmiterResult<Pregunta>>();
  dimensiones = input.required<Dimension[]>();
  tipoPregunta = input.required<TipoPregunta[]>();
  instrumento = input<Instrumento|null>();

  openModalAddQuestion()
  {
    this.modalActivo = this.modalService.createModal('modalAdd');
    this.resetPregunta();
    this.modalActivo.show();
  }

  onSubmitQuestion(){
    if(this.preguntaForm.valid)
      {
        const pregunta: Pregunta = this.preguntaForm.value as Pregunta;
        pregunta.dimesionId = Number(pregunta.dimesionId);
        pregunta.instrumentoId = this.instrumento()!.id;
        pregunta.tipoPreguntaId = Number(pregunta.tipoPreguntaId);

         this.outputPostType.emit({typeModal: this.PostType(), data: pregunta})
    }     
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

  closeModal(){
    this.modalActivo.hide();
  }
}
