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
import { Cargo, CargoAsignacion, CargosDependenciaGet } from '@interfaces/cargo';
import { EvaluacionCargoService } from '@services/sed/evaluacion-cargo.service';
import { CantidadAddModalComponent } from './cantidad-add-modal/cantidad-add-modal.component';
import { Dependencia } from '@interfaces/dependencia';
import { toSignal } from '@angular/core/rxjs-interop';
import { EvaluacionCargo } from '@interfaces/evaluacion-cargo';

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
  cargosArreglo:CargosDependenciaGet[] = [];
  tempCargosArreglo:CargosDependenciaGet[] = [];
  cargosAsignadosArreglo:CargosDependenciaGet[] = [];

  cargoId = input.required<number>({alias: "id"});
  dependenciaId = input.required<number>({alias: "dependenciaId"});

  cargoSvc = inject(CargoService);
  evaluacionCargoSvc = inject(EvaluacionCargoService);
  CargoSvc = inject(CargoService);
  dependencia = signal<Dependencia>({id: 0, nombre: '', dependenciaId: 0})
  save = true;
  cantidadModal = viewChild.required(CantidadAddModalComponent);
  cargosSignal = signal<CargosDependenciaGet[]>([])
  cargoSignal = signal<Cargo>({} as Cargo);

  saveCargos(){
    this.save = true;
    this.evaluacionCargoSvc.delete(this.cargoId()).subscribe({
      next: (response) => {
        this.cargosAsignadosArreglo.forEach((c) => {
          const cCargo: EvaluacionCargo = {
            id: 0,
            cargoEvaluadorId: this.cargoId(),
            cargoId: c.cargoID,
            dependenciaId: c.dependenciaID,
            cantidadEvaluados: 1
          }
          this.evaluacionCargoSvc.post(cCargo).subscribe({
            next: (response) => {

            }
          })
        })
      }
    })


  }

  ngOnInit(): void {
    this.getCargos();

    //this.getDependencia();
    this.getCargo();
  }

  getCargo(){
    this.CargoSvc.getCargo(this.cargoId()).subscribe({
      next: (c) => {
        this.cargoSignal.set(c.data);
      }
    })
  }

  getDependencia(){
    this.evaluacionCargoSvc.getDependencia(this.cargoId()).subscribe({
      next:(dp) => {
        this.dependencia.set(dp.data);
      }
    })
  }

  getEvaluacionCargoPlusCargo(){

  }

  getCargos(){
    this.cargoSvc.getWithCargos(this.cargoId(), this.dependenciaId()).subscribe({
      next: (c) => {
        this.cargosSignal.set(c.data);
        this.cargosArreglo = c.data;
        this.tempCargosArreglo = c.data;
        this.evaluacionCargoSvc.getEvaluacionCargoAsignados(this.cargoId()).subscribe({
          next: (c) => {
            console.log(c)
            if(c.data != null){
              this.cargosAsignadosArreglo = c.data;
              this.cargosSignal.update((p) => {
                return p.filter((d) => !this.cargosAsignadosArreglo.some(some => some.cargoID == d.cargoID))
              })
              this.cargosArreglo = this.cargosSignal();
              this.tempCargosArreglo = this.cargosSignal();
            }
          }
        })
      }
    })
  }

  handlerSearch(texto: Event){
    const textoEvento = texto.target as HTMLInputElement;
    const value = textoEvento.value;
    this.tempCargosArreglo = this.cargosArreglo.filter((word) => word.cargoNombre.toLowerCase().includes(value.toLowerCase()))
  }

  saludo(item: CargosDependenciaGet){
    this.cantidadModal().openModal(6, item);
  }

  drop(event: CdkDragDrop<CargosDependenciaGet[]>) {
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
        return a.cargoID === data.cargoID })
    });

    console.log(this.tempCargosArreglo);
    console.log(this.cargosAsignadosArreglo);

  }


}
