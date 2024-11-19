import { CommonModule } from '@angular/common';
import { Component, inject, signal, viewChild, type OnInit } from '@angular/core';
import { TipoEvaluacionesService } from '@services/sed/TipoEvaluaciones.service';
import { toSignal } from '@angular/core/rxjs-interop'
import { TitleComponent } from 'app/shared/title/title.component';
import { RouterLink } from '@angular/router';
import { ModalPorcentajeComponent } from './modal-porcentaje/modal-porcentaje.component';
import { TipoEvaluacion } from '@interfaces/tipo_evaluacion';

@Component({
    selector: 'app-tipo-evaluacion',
    imports: [
        CommonModule, TitleComponent, RouterLink, ModalPorcentajeComponent
    ],
    templateUrl: './TipoEvaluacion.component.html',
    styleUrl: './TipoEvaluacion.component.css'
})
export default class TipoEvaluacionComponent {

  tiposEvaluacionesSvc = inject(TipoEvaluacionesService)

  tipos = signal<TipoEvaluacion[]>([]);
  modalPorcentajeVc = viewChild.required(ModalPorcentajeComponent)
  ngOnInit(): void {
    this.tiposEvaluacionesSvc.get().subscribe({
      next: (tipos) => {
        this.tipos.set(tipos.data);
      }
    })
  }
  openModalPorcentaje(TipoEvaluacion: TipoEvaluacion){
    this.modalPorcentajeVc().openModal(TipoEvaluacion);
  }

  actualizarPorcentaje(event: TipoEvaluacion){
    this.tipos.update((t) => t.map((tipos) => (tipos.id === event.id) ? event : tipos))
  }


}
