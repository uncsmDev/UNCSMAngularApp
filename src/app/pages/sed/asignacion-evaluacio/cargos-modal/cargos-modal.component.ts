import { CommonModule } from '@angular/common';
import { Component, inject, signal} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Cargo } from '@interfaces/cargo';
import { Dependencia, DependenciaList } from '@interfaces/dependencia';
import { CargoService } from '@services/admin/cargo.service';
import { ModalService } from '@services/modal.service';
import { ModalInterface } from 'flowbite';

@Component({
  selector: 'app-cargos-modal',
  standalone: true,
  imports: [
    CommonModule, RouterLink
  ],
  templateUrl: './cargos-modal.component.html',
  styleUrl: './cargos-modal.component.css',
})
export class CargosModalComponent {

  modalActivo!: ModalInterface;
  private fb = inject(FormBuilder);
  private modalService = inject(ModalService);
  text:string = 'Agregar';
  textCargo = ''
  cargoSvc = inject(CargoService);
  router = inject(Router);
  cargos = signal<Cargo[]>([])
  cargosBusqueda = signal<Cargo[]>([])
  dependenciaSignal = signal<DependenciaList>({id: 0, nombre: '', dependenciaId: 0})
  closeModal(){
    this.modalActivo.hide();
  }

  openModal(cargo: DependenciaList)
  {
    this.getCargos(cargo);
    this.text = 'Agregar';
    this.modalActivo = this.modalService.createModal('cargos');
    this.modalActivo.show();
  }

  getCargos(dependencia: DependenciaList){
    this.dependenciaSignal.set(dependencia);
    this.cargoSvc.getWithoutEvaluacionCargo(dependencia).subscribe({
      next: (c) => {
        console.log(c);
        this.cargos.set(c.data);
        this.cargosBusqueda.set(c.data);
      }
    })
  }

  link(cargo: Cargo)
  {
    this.closeModal();
    this.router.navigate(['/sed/asignacion/', cargo.id, this.dependenciaSignal().id]);
  }

  handlerSearch(texto: Event){
    const textoEvento = texto.target as HTMLInputElement;
    const value = textoEvento.value;
    this.cargos.set(this.cargosBusqueda().filter((word) => word.nombre.toLowerCase().includes(value.toLowerCase())))
  }

}
