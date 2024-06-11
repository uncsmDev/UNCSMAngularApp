import { Injectable } from '@angular/core';
import { InstanceOptions, Modal, ModalInterface, ModalOptions } from 'flowbite';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() { }

  createModal(nameModal:string){

    const $modalElement: HTMLElement | null = document.getElementById(nameModal);
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
          //console.log('modal is hidden');
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
  return modal;
  }
}
