import { CommonModule } from '@angular/common';
import { Component, inject, output, signal, type OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TipoEntidad } from '@interfaces/tipoEntidad';
import { TipoEntidadService } from '@services/admin/tipoEntidad.service';
import { ModalService } from '@services/modal.service';
import { ModalInterface } from 'flowbite';

@Component({
  selector: 'app-instrumento-add-modal',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './instrumento-add-modal.component.html',
  styleUrl: './instrumento-add-modal.component.css',
})
export class InstrumentoAddModalComponent {

  modalActivo!: ModalInterface;
  fb = inject(FormBuilder);
  modalService = inject(ModalService);
  
  tipoEntidadService = inject(TipoEntidadService);
  tipoEntidadesSginal = signal<TipoEntidad[]>([]);

  text:string = 'Agregar';

  //outputPostType = output<EmiterResult<Instrumento>>();

  onSubmit(){
    
  }

  getTipoEntidad(){
    this.tipoEntidadService.getList().subscribe({
      next: (tipo_entidad) => {
        this.tipoEntidadesSginal.set(tipo_entidad);
      }
    })
  }

  closeModal(){
    this.modalActivo.hide();
  }

  openModal()
  {
    this.getTipoEntidad()
    this.text = 'Agregar';
    this.modalActivo = this.modalService.createModal('instrumento-add');
    this.modalActivo.show();
  }

  getInstrumento(){
    console.info('Funciona');
  }

}
