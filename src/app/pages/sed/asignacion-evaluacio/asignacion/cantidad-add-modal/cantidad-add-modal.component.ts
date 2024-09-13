import { CommonModule } from '@angular/common';
import { Component, inject, model, signal} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Cargo, CargoAsignacion, CargosDependenciaGet } from '@interfaces/cargo';
import { CargoService } from '@services/admin/cargo.service';
import { ModalService } from '@services/modal.service';
import { ModalInterface } from 'flowbite';

@Component({
  selector: 'app-cantidad-add-modal',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule
  ],
  templateUrl: './cantidad-add-modal.component.html',
  styleUrl: './cantidad-add-modal.component.css',
})
export class CantidadAddModalComponent {

  modalActivo!: ModalInterface;
  private fb = inject(FormBuilder);
  private modalService = inject(ModalService);
  private cargoSvc = inject(CargoService);

  formCount = this.fb.group({
    cantidad: 0
  })

  cantidad = signal<number>(0);
  cantidadArreglo = signal<number[]>([]);

  text:string = 'Agregar';
  textCargo = ''
  
  closeModal(){
    this.modalActivo.hide();
  }

  openModal(cargo: CargosDependenciaGet)
  {
    this.cargoSvc.countCargoTrabajadores(cargo.cargoID, cargo.dependenciaID).subscribe({
      next: (response) => {
        console.log(response);
        this.cantidad.set(response.data);
        this.cantidadArreglo.set([]);
        for (let i = 1; i <= this.cantidad(); i++) {
          this.cantidadArreglo.update((prev) => [...prev, i]);
        }
      }
    })
    this.text = 'Agregar';
    this.textCargo = cargo.cargoNombre;
    this.modalActivo = this.modalService.createModal('cantidad-add');
    this.modalActivo.show();
    
    
  }

}
