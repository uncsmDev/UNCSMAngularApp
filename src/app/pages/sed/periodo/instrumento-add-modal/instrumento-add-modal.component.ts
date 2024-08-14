import { CommonModule } from '@angular/common';
import { Component, inject, output, signal, type OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Instrumento } from '@interfaces/instrumento';
import { TipoEntidad } from '@interfaces/tipoEntidad';
import { TipoEntidadService } from '@services/admin/tipoEntidad.service';
import { ModalService } from '@services/modal.service';
import { InstrumentoService } from '@services/sed/instrumento.service';
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
  instrumentoService = inject(InstrumentoService);
  tipoEntidadesSginal = signal<TipoEntidad[]>([]);

  text:string = 'Agregar';

  instrumentosSignal = signal<Instrumento[]>([])
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

  getInstrumento(event: Event){
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    this.instrumentoService.getInstrumentoxEntidad(Number(selectedValue)).subscribe({
      next: (instrumentos) => {
        const data = instrumentos.data!;
        if(data != null)
        {
          this.instrumentosSignal.set(data);
        }
      }
    })
  }

}
