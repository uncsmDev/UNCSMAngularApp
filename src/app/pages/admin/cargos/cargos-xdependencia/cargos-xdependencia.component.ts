import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModalService } from '@services/modal.service';
import { ModalInterface } from 'flowbite';

@Component({
  selector: 'app-cargos-xdependencia',
  imports: [],
  templateUrl: './cargos-xdependencia.component.html',
  styleUrl: './cargos-xdependencia.component.css'
})
export class CargosXDependenciaComponent {

    modalActivo!: ModalInterface;
    fb = inject(FormBuilder);
    modalService = inject(ModalService);

  ngOnInit(): void {
  }

  openModal(idDependencia:number) {
    this.modalActivo = this.modalService.createModal('cargosxdependencia-modal');
    this.modalActivo.show();
  }

  closeModal()
  {
    this.modalActivo.hide();
    this.modalActivo.destroy();
  }


}
