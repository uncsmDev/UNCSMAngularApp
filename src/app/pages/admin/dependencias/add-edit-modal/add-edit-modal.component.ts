import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { tipoModal } from '@interfaces/trabajador';
import { ModalService } from '@services/modal.service';
import { SweetalertService } from '@services/sweetalert.service';
import { ModalInterface } from 'flowbite';

@Component({
  selector: 'app-add-edit-modal',
  imports: [],
  templateUrl: './add-edit-modal.component.html',
  styleUrl: './add-edit-modal.component.css'
})
export class AddEditModalComponent {

   sweetalert = inject(SweetalertService);

  modalActivo!: ModalInterface;
  fb = inject(FormBuilder);
  modalService = inject(ModalService);

  dependenciaForm = this.fb.group({
    dependenciaId: [0],
    nombre: ['']
  });

  openModal(input:number) 
  {
    this.dependenciaForm.controls['dependenciaId'].setValue(input);

    this.modalActivo = this.modalService.createModal('add-edit-modal');
    this.modalActivo.show();
  }

  closeModal()
  {
    this.modalActivo.hide();
    this.modalActivo.destroy();
  }

}
