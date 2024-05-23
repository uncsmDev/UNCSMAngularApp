import { Component, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { EscalaService } from '../../../../Services/escala.service';
import { Escala } from '../../../../interfaces/escala';
import { Modal } from 'flowbite';
import type { ModalOptions, ModalInterface } from 'flowbite';
import type { InstanceOptions } from 'flowbite';
import { TitleComponent } from '../../../../shared/title/title.component';



@Component({
  selector: 'app-escala',
  standalone: true,
  imports: [TitleComponent],
  templateUrl: './escala.component.html',
  styleUrl: './escala.component.css'
})
export default class EscalaComponent {
  
  
  escalaService = inject(EscalaService);

  escalas: WritableSignal<Escala[]> = signal([]);
  escalasNotEdit: Signal<Escala[]> = computed(this.escalas);
  modalActivo!: ModalInterface;

  ngOnInit() {

    this.escalaService.get()
    .subscribe({
      next: (resp)=> {
        const mod = resp.map(item => ({
          id: item.id,
          nombre: item.nombre, // Transforma 'nombre' a 'titulo'
          simbologia: item.simbologia,
          valoracion: item.valoracion,
          nivelCumplimiento: item.nivelCumplimiento,
          eliminado: item.eliminado,
          visible: item.visible,
        }));

        this.escalas.set(mod);
        console.log(this.escalas())
      },
      error: (error) =>{
        console.error("Error", error);
      }
    })
  }

  createModal(){

    const $modalElement: HTMLElement | null = document.getElementById('static-modal');
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
          console.log('modal is shown');
      },
      onToggle: () => {
          console.log('modal has been toggled');
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

  closeModal(){
    this.modalActivo.hide();
  }
  
}
