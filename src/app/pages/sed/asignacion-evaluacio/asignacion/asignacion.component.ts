import { CommonModule } from '@angular/common';
import { Component, inject, input, signal, viewChild, type OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { TitleComponent } from 'app/shared/title/title.component';
import { RouterLink } from '@angular/router';
import { CargoService } from '@services/admin/cargo.service';
import { Cargo, CargoAsignacion } from '@interfaces/cargo';
import { EvaluacionCargoService } from '@services/sed/evaluacion-cargo.service';
import { EvaluacionCargo } from '@interfaces/evaluacion_cargo';
import { CantidadAddModalComponent } from './cantidad-add-modal/cantidad-add-modal.component';

@Component({
  selector: 'app-asignacion',
  standalone: true,
  imports: [
    CommonModule, CdkDropList, CdkDrag, TitleComponent, CantidadAddModalComponent
  ],
  templateUrl: './asignacion.component.html',
  styleUrl: './asignacion.component.css',
})
export default class AsignacionComponent implements OnInit {

  texto = '';
  cargosArreglo:CargoAsignacion[] = [];
  tempCargosArreglo:CargoAsignacion[] = [];
  cargosAsignadosArreglo:CargoAsignacion[] = [];

  cargoId = input.required<number>({alias: "id"})
  cargoSvc = inject(CargoService);
  evaluacionCargoSvc = inject(EvaluacionCargoService);
  cargo = signal<Cargo>({id: 0, nombre: '', descripcion: ''})
  save = true;
  cantidadModal = viewChild.required(CantidadAddModalComponent);

  cargos = signal<Cargo[]>([])

  saveCargos(){
    this.save = true;
  }

  ngOnInit(): void {
    this.getCargo();
    this.getCargos();
    this.getEvaluacionCargo();
  }

  getCargo(){
    this.cargoSvc.getCargo(this.cargoId()).subscribe({
      next: (c) => {
        this.cargo.set(c.data);
      }
    })
  }

  getEvaluacionCargo(){
    this.evaluacionCargoSvc.getEvaluacionCargo(this.cargoId()).subscribe({
      next: (c) => {
        this.cargosAsignadosArreglo = c.data;
      }
    })
  }

  getCargos(){
    this.cargoSvc.getWithoutEvaluacionCargo(this.cargoId()).subscribe({
      next: (c) => {
        this.cargos.set(c.data);
        this.cargosArreglo = c.data;
        this.tempCargosArreglo= c.data;
      }
    })
  }

  handlerSearch(texto: Event){
    const textoEvento = texto.target as HTMLInputElement;
    const value = textoEvento.value;
    this.tempCargosArreglo = this.cargosArreglo.filter((word) => word.nombre.toLowerCase().includes(value.toLowerCase()))
  }

  saludo(item: CargoAsignacion){
    this.cantidadModal().openModal(6, item);
  }

  comprobarParamostrar(item: number){
    return !this.cargosAsignadosArreglo.some((a) => a.id == item);
  }

  drop(event: CdkDragDrop<CargoAsignacion[]>) {
    
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if (event.container.id === 'cargos_asignados') {
        
      } else if (event.container.id === 'cargos') {

      }
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.save = false;
    }
    this.tempCargosArreglo = this.tempCargosArreglo.filter((data, index, self) =>{
      return index === self.findIndex((a) => {
        return a.id === data.id })
    });
    
  }
  

}
