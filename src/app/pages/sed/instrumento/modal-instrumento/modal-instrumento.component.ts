import { Component, inject, input, output, signal, viewChild } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Instrumento, tipoModal } from '@interfaces/instrumento';
import { InstrumentoService } from '@services/sed/instrumento.service';
import { ModalInterface } from 'flowbite';
import InstrumentoComponent from '../instrumento.component';
import { ModalService } from '@services/modal.service';
import { TipoEntidad } from '@interfaces/tipoEntidad';
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
  instrumentoService = inject(InstrumentoService)

  tipoEntidades = input.required<TipoEntidad[]>();

  instrumentoForm = this.fb.group({
    id: [0, [Validators.required]],
    nombre: ['', [Validators.required]],
    tipoEntidadId: [0, [Validators.required, this.instrumentoService.notZeroValidator]],
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
         this.reset();
    }     
  }

  closeModal(){
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

  openModalEdit(inst: Instrumento | null)
  {
    this.text = 'Editar';
    this.instrumentoForm.controls['id'].setValue(inst!.id);
    this.instrumentoForm.controls['nombre'].setValue(inst!.nombre);
    this.instrumentoForm.controls['tipoEntidadId'].setValue(inst!.tipoEntidadId);
    this.modalActivo = this.modalService.createModal('static-modal');
    this.modalActivo.show();
  }
}

