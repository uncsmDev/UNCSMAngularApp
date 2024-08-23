import { CommonModule } from '@angular/common';
import { Component, inject, input, signal, type OnInit } from '@angular/core';
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
import { Cargo } from '@interfaces/cargo';
import { EvaluacionCargoService } from '@services/sed/evaluacion-cargo.service';

@Component({
  selector: 'app-asignacion',
  standalone: true,
  imports: [
    CommonModule, CdkDropList, CdkDrag, TitleComponent
  ],
  templateUrl: './asignacion.component.html',
  styleUrl: './asignacion.component.css',
})
export default class AsignacionComponent implements OnInit {
  cargosArreglo:Cargo[] = [];
  cargosAsignadosArreglo:Cargo[] = [];

  cargoId = input.required<number>({alias: "id"})
  cargoSvc = inject(CargoService);
  evaluacionCargoSvc = inject(EvaluacionCargoService);
  cargo = signal<Cargo>({id: 0, nombre: '', descripcion: ''})
  
  cargos = signal<Cargo[]>([])
  

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
      }
    })
  }

  saludo(){
    console.log("Hola chiquito")
  }

  drop(event: CdkDragDrop<Cargo[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

}
