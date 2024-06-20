import { Component, inject, input, output, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Instrumento, tipoModal } from '@interfaces/instrumento';
import { InstrumentoService } from '@services/sed/instrumento.service';
import { ModalInterface } from 'flowbite';
import InstrumentoComponent from '../instrumento.component';
import { ModalService } from '@services/modal.service';
import { TipoEntidad } from '@interfaces/tipoEntidad';
import { TipoEvaluacion } from '@interfaces/tipo_evaluacion';
import { EmiterResult } from '@interfaces/EmiterResult';

@Component({
  selector: 'app-modal-instrumento',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './modal-instrumento.component.html',
  styleUrl: './modal-instrumento.component.css'
})
export class ModalInstrumentoComponent {
  modalActivo!: ModalInterface;
  fb = inject(FormBuilder);
  modalService = inject(ModalService);

  tipoEntidades = input.required<TipoEntidad[]>();
  tipoEvaluaciones = input.required<TipoEvaluacion[]>();
  instrumento = input<Instrumento|null>();

  instrumentoForm = this.fb.group({
    id: [0, [Validators.required]],
    nombre: ['', [Validators.required]],
    tipoEntidadId: [0, [Validators.required]],
    tipoEvaluacionId: [0, [Validators.required]]
  });

  PostType = input.required<tipoModal>();
  text:string = 'Agregar';

  outputPostType = output<EmiterResult<Instrumento>>();

  onSubmit(){
    if(this.instrumentoForm.valid)
    {
         const instrumento: Instrumento = this.instrumentoForm.value as Instrumento;
         this.outputPostType.emit({typeModal: this.PostType(), data: instrumento})
    }     
  }

  closeModal(){
    debugger
    this.modalActivo.hide();
  }

  reset()
  {
    this.instrumentoForm.reset(
      {
        id: 0,
        nombre: '',
        tipoEntidadId: 0,
        tipoEvaluacionId: 0
      }
    );
  }

  openModal()
  {
    this.reset()

    this.text = 'Agregar';
    this.modalActivo = this.modalService.createModal('static-modal');
    this.modalActivo.show();
  }

  openModalEdit()
  {
    this.text = 'Editar';
    console.log(this.instrumento())
    this.instrumentoForm.controls['id'].setValue(this.instrumento()!.id);
    this.instrumentoForm.controls['nombre'].setValue(''+this.instrumento()!.nombre);
    this.instrumentoForm.controls['tipoEntidadId'].setValue(this.instrumento()!.tipoEntidadId);
    this.instrumentoForm.controls['tipoEvaluacionId'].setValue(this.instrumento()!.tipoEvaluacionId);
    this.modalActivo = this.modalService.createModal('static-modal');
    this.modalActivo.show();
  }
}

