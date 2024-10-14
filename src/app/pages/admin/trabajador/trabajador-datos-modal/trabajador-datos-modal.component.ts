import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EmiterResult } from '@interfaces/EmiterResult';
import { tipoModal, Trabajador } from '@interfaces/trabajador';
import { ModalService } from '@services/modal.service';
import { ModalInterface } from 'flowbite';

@Component({
  selector: 'app-trabajador-datos-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './trabajador-datos-modal.component.html',
  styleUrl: './trabajador-datos-modal.component.css'
})
export class TrabajadorDatosModalComponent {

  modalActivo!: ModalInterface;
  fb = inject(FormBuilder);
  modalService = inject(ModalService);

  PostType = input.required<tipoModal>();
  text:string = 'Agregar';

 // outputPostType = output<EmiterResult<Trabajador>>();

  openModal()
  {
    this.reset()
    //this.instrumentoId.set(idInstrumento);
    this.text = 'Editar';
    this.modalActivo = this.modalService.createModal('static-modal');
    this.modalActivo.show();
  }

  reset()
  {
   /* this.instrumentoForm.reset(
      {
        id: 0,
        nombre: ''
      }
    );*/
  }

  closeModal(){
    this.modalActivo.hide();
  }

}
