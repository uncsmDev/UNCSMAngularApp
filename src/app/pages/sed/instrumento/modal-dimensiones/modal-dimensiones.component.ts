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
import { Dimension } from '@interfaces/dimension';

@Component({
  selector: 'app-modal-dimensiones',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './modal-dimensiones.component.html',
  styleUrl: './modal-dimensiones.component.css'
})
export class ModalDimensionesComponent {
  modalActivo!: ModalInterface;
  fb = inject(FormBuilder);
  modalService = inject(ModalService);

  instrumentoId = signal<number>(0);

  dimensionForm = this.fb.group({
    id: [0, [Validators.required]],
    nombre: ['', [Validators.required]],
    instrumentoId: [0, [Validators.required]]
  });

  PostType = input.required<tipoModal>();
  text:string = 'Agregar';

  outputPostType = output<EmiterResult<Dimension>>();

  onSubmit(){
    if(this.dimensionForm.valid)
    {
         this.dimensionForm.value.instrumentoId = this.instrumentoId();
         const dimension: Dimension = this.dimensionForm.value as Dimension;
         this.outputPostType.emit({typeModal: this.PostType(), data: dimension})
         this.reset()
    }     
  }

  closeModal(){
    this.modalActivo.hide();
  }

  reset()
  {
    this.dimensionForm.reset(
      {
        id: 0,
        nombre: '',
        instrumentoId: 0,
      }
    );
  }

  openModal(idInstrumento: number)
  {
    this.reset()

    this.instrumentoId.set(idInstrumento);
    this.text = 'Agregar';
    this.modalActivo = this.modalService.createModal('modal-dimensiones');
    this.modalActivo.show();
  }

  openModalEdit(inst: Dimension | null)
  {
    this.text = 'Editar';
    this.dimensionForm.controls['id'].setValue(inst!.id);
    this.dimensionForm.controls['nombre'].setValue(inst!.nombre);
    this.dimensionForm.controls['instrumentoId'].setValue(this.instrumentoId());
    this.modalActivo = this.modalService.createModal('modal-dimensiones');
    this.modalActivo.show();
  }
}
