import { Escala } from './../../interfaces/escala';
import { Component, EventEmitter, Input, Output, output, signal } from '@angular/core';
import { InstanceOptions, Modal, ModalInterface, ModalOptions } from 'flowbite';

@Component({
    selector: 'app-modal-delete',
    imports: [],
    templateUrl: './modal-delete.component.html',
    styles: ``
})
export class ModalDeleteComponent {
  modalActivo!: ModalInterface;
  outputEvent = output();

  emitEvent(): void {
    this.outputEvent.emit();
    this.closeModalDelete();
  }

  createModal(){
    const $modalElement: HTMLElement | null = document.getElementById('popup-modal');
    if (!$modalElement) {
      throw new Error('Elemento modal no encontrado');
    }

    const modalOptions: ModalOptions = {
      placement: 'bottom-right',
      backdrop: 'dynamic',
      backdropClasses:
          'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
      closable: true,
      onHide: () => {
          console.log('modal is hidden');
      },
      onShow: () => {
          //console.log('modal is shown');
      },
      onToggle: () => {
          //console.log('modal has been toggled');
      },
  };
  
  // instance options object
  const instanceOptions: InstanceOptions = {
    id: 'modalEl',
    override: true
  };
  
  const modal: ModalInterface = new Modal($modalElement, modalOptions, instanceOptions);
  this.modalActivo = modal;
  }

  openModal()
  {
    this.createModal();
    this.modalActivo.show();
  }

  closeModalDelete(){
    this.modalActivo.hide();
  }
}
