import { CommonModule } from '@angular/common';
import { Component, inject} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Cargo, CargoAsignacion, CargosDependenciaGet } from '@interfaces/cargo';
import { ModalService } from '@services/modal.service';
import { ModalInterface } from 'flowbite';

@Component({
  selector: 'app-cantidad-add-modal',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './cantidad-add-modal.component.html',
  styleUrl: './cantidad-add-modal.component.css',
})
export class CantidadAddModalComponent {

  modalActivo!: ModalInterface;
  private fb = inject(FormBuilder);
  private modalService = inject(ModalService);
  text:string = 'Agregar';
  textCargo = ''
  
  closeModal(){
    this.modalActivo.hide();
  }

  openModal(cantidad: number, cargo: CargosDependenciaGet)
  {
    this.text = 'Agregar';
    this.textCargo = cargo.cargoNombre;
    this.modalActivo = this.modalService.createModal('cantidad-add');
    this.modalActivo.show();
  }

}
