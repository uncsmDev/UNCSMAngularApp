import { CommonModule } from '@angular/common';
import { Component, inject, model, signal, output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Cargo, CargoAsignacion, CargosDependenciaGet } from '@interfaces/cargo';
import { CargoService } from '@services/admin/cargo.service';
import { ModalService } from '@services/modal.service';
import { EvaluacionCargoService } from '@services/sed/evaluacion-cargo.service';
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
  private evaluacionCargoSvc = inject(EvaluacionCargoService);
  cargo = signal<CargosDependenciaGet>({} as CargosDependenciaGet);
  formCount = this.fb.group({
    cantidad: 1
  })

  cantidad = signal<number>(1);
  cantidadArreglo = signal<number[]>([]);

  emitCantidad= output<CargosDependenciaGet>();

  text:string = 'Agregar';
  textCargo = ''
  
  closeModal(){
    this.modalActivo.hide();
  }

  openModal(cargo: CargosDependenciaGet)
  {
    this.cargo.set(cargo);
    this.formCount.controls['cantidad'].setValue(cargo.cantidadEvaluado!);
    this.cargoSvc.countCargoTrabajadores(cargo.cargoID, cargo.dependenciaID).subscribe({
      next: (response) => {
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

  changeCount(event: Event){
    const value = (event.target as HTMLInputElement).value;
    this.cantidad.set(parseInt(value));
    this.cargo.update((prev) => ({...prev, cantidadEvaluado: parseInt(value)}));
    this.evaluacionCargoSvc.updateCantidad(this.cargo().id!, this.cantidad()).subscribe({
      next: (response) => {
        this.emitCantidad.emit(this.cargo());
      }
    })
  }

}
