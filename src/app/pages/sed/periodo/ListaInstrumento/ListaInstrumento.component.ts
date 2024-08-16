import { Result } from '@interfaces/Result.interface';
import { CommonModule } from '@angular/common';
import { Component, inject, input, signal, OnInit, viewChild, output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Instrumento } from '@interfaces/instrumento';
import { Periodo, PeriodoInstrumento, PeriodoxInstrumento } from '@interfaces/periodo';
import { TipoEntidad } from '@interfaces/tipoEntidad';
import { TipoEntidadService } from '@services/admin/tipoEntidad.service';
import { PeriodoxinstrumentoService } from '@services/sed/periodoxinstrumento.service';
import { ModalDeleteComponent } from 'app/components/modal-delete/modal-delete.component';

@Component({
  selector: 'app-lista-instrumento',
  standalone: true,
  imports: [
    CommonModule, ModalDeleteComponent
  ],
  templateUrl: './ListaInstrumento.component.html',
  styleUrl: './ListaInstrumento.component.css',
})
export class ListaInstrumentoComponent { 

  instrumento = input.required<Instrumento>();
  periodo = input.required<Periodo>();
  tipoEntidadService = inject(TipoEntidadService);
  matSnackBar=inject(MatSnackBar);
  tipoEntidadSignal = signal<TipoEntidad>({nombre: '', id: 0})
  ModalDelete = viewChild(ModalDeleteComponent);
  deletePeriodoInstrumento = output();
  periodoxinstrumentoService = inject(PeriodoxinstrumentoService);

  ngOnInit(){
    this.getTipoEntidad();
  }

  getTipoEntidad()
  {
    this.tipoEntidadService.getTipoEntidadByInstrumento(this.instrumento()!).subscribe({
      next: (TipoEntidad) => {
        this.tipoEntidadSignal.set(TipoEntidad.data!);
      }
    })
  }

  deleteInstrumentPeriodo(){
    const peridodxInstrumento:PeriodoxInstrumento = {instrumentoId:this.instrumento().id, periodoId: this.periodo().id}
    this.periodoxinstrumentoService.del(peridodxInstrumento).subscribe({
      next:(response) => {
        console.log(response);
        this.deletePeriodoInstrumento.emit();
        this.matSnackBar.open(response.message,'Cerrar',{ duration:5000, horizontalPosition:'center'});
      },
      error: (error)=> {
        this.matSnackBar.open("Error al eliminar el dato",'Cerrar',{ duration:5000, horizontalPosition:'center'})
      }
    })
  }

  callModalDelete() {
    if(this.ModalDelete()){
      this.ModalDelete()!.openModal(); // Llama al método doSomething del componente hijo
    }
  }
}
