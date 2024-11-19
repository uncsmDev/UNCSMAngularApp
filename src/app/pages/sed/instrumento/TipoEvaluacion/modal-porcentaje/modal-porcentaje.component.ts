import { TipoEvaluacion } from './../../../../../interfaces/tipo_evaluacion';
import { CommonModule } from '@angular/common';
import { Component, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalService } from '@services/modal.service';
import { TipoEvaluacionesService } from '@services/sed/TipoEvaluaciones.service';
import { ModalInterface } from 'flowbite';

@Component({
    selector: 'app-modal-porcentaje',
    imports: [
        CommonModule, FormsModule
    ],
    templateUrl: './modal-porcentaje.component.html',
    styleUrl: './modal-porcentaje.component.css'
})
export class ModalPorcentajeComponent { 

  modalActivo!: ModalInterface;
  modalService = inject(ModalService);
  TipoEvaluacionId= signal(0);
  TipoEvaluacion= signal<TipoEvaluacion>({} as TipoEvaluacion);
  porcentaje = signal(0);
  activateError = signal(true);
  tipoEvaluacionSvc = inject(TipoEvaluacionesService);
  matSnackBar=inject(MatSnackBar);
  outputEmit = output<TipoEvaluacion>();
  closeModal(){
    this.modalActivo.hide();
  }

  openModal(TipoEvaluacionId: TipoEvaluacion)
  {
    this.TipoEvaluacion.set(TipoEvaluacionId);
    this.TipoEvaluacionId.set(this.TipoEvaluacion().id!);
    TipoEvaluacionId.porcentaje ? this.porcentaje.set(TipoEvaluacionId.porcentaje) : this.porcentaje.set(0);
    this.modalActivo = this.modalService.createModal('modal-dimensiones');
    this.modalActivo.show();
  }

  updatePorcentaje(){
    if(this.porcentaje() > 0 && this.porcentaje() <= 100){
      this.activateError.set(true);
      this.tipoEvaluacionSvc.updatePorcentaje(this.porcentaje(), this.TipoEvaluacionId()).subscribe({
        next: (res) => {
          const porcentaje = res.data!.porcentaje!;
          this.TipoEvaluacion.update((t) => ({...t, porcentaje: porcentaje}));
          this.outputEmit.emit(this.TipoEvaluacion());
          this.modalActivo.hide();
          this.porcentaje.set(0);
          this.matSnackBar.open("Dato guardado correctamente",'Cerrar',{ duration:5000, horizontalPosition:'center'});
        }
      })
    }
    else{
      this.activateError.set(false);
    }
  }

}
