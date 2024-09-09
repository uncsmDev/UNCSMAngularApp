import { CommonModule } from '@angular/common';
import { Component, inject, input, output, signal, viewChild, type OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Instrumento } from '@interfaces/instrumento';
import { Periodo, PeriodoxInstrumento } from '@interfaces/periodo';
import { TipoEntidad } from '@interfaces/tipoEntidad';
import { TipoTrabajadorService } from '@services/admin/tipoTrabajador.service';
import { ModalService } from '@services/modal.service';
import { InstrumentoService } from '@services/sed/instrumento.service';
import { PeriodoxinstrumentoService } from '@services/sed/periodoxinstrumento.service';
import { ModalInterface } from 'flowbite';
import PeriodoComponent from '../periodo.component';

@Component({
  selector: 'app-instrumento-add-modal',
  standalone: true,
  imports: [
    CommonModule, PeriodoComponent
  ],
  templateUrl: './instrumento-add-modal.component.html',
  styleUrl: './instrumento-add-modal.component.css',
})
export class InstrumentoAddModalComponent {

  modalActivo!: ModalInterface;
  private fb = inject(FormBuilder);
  private modalService = inject(ModalService);
  private periodoxinstrumentoService = inject(PeriodoxinstrumentoService)

  private tipoEntidadService = inject(TipoTrabajadorService);
  private instrumentoService = inject(InstrumentoService);
  tipoEntidadesSignal = signal<TipoEntidad[]>([]);
  tipoEntidadIdSignal = signal(0);
  public instrumentosAdd = signal<PeriodoxInstrumento[]>([])
  public periodo = signal<Periodo>({id: 0, fechaFin: '', fechaInicio: '', nombre: ''})
  instrumentoActualSignal = signal<Instrumento>({id:0, nombre:'', tipoTrabajadorId:0, tipoEvaluacionId: 0})
  text:string = 'Agregar';
  isSubmitting = signal(false);
  refresh = output();

  instrumentosSignalAdd = signal<Instrumento[]>([])
  //outputPostType = output<EmiterResult<Instrumento>>();

  onSubmit(){
    
  }

  getTipoEntidad(){
    this.tipoEntidadService.getList().subscribe({
      next: (tipo_entidad) => {
        this.tipoEntidadesSignal.set(tipo_entidad);
      }
    })
  }

  closeModal(){
    this.refresh.emit();
    this.modalActivo.hide();
  }

  openModal(instrumentosAddParam: PeriodoxInstrumento[], periodo: Periodo)
  {
    this.getTipoEntidad()
    this.text = 'Agregar';
    this.modalActivo = this.modalService.createModal('instrumento-add');
    this.modalActivo.show();
    this.instrumentosAdd.set(instrumentosAddParam);
    this.periodo.set(periodo);
  }

  getInstrumento(event: Event){
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    this.tipoEntidadIdSignal.set(Number(selectedValue));
    this.instrumentoService.GetxTipoTrabajadorxTipoEvaluacion(Number(selectedValue), 2).subscribe({
      next: (instrumentos) => {
        const data = instrumentos.data!;
        if(data != null)
        {
          this.instrumentosSignalAdd.set(data);
        }
      }
    })
  }

  comprobarSeleccion(instrumento: Instrumento) : boolean {
    if(this.instrumentosAdd().length> 0){
      return this.instrumentosAdd().some((inst) => inst.instrumentoId == instrumento.id);
    }
    else{
      return false;
    }
  }
  
  asignarInstrumento(instrumento: Instrumento): void {
    const actual = this.instrumentosAdd().find((inst) => inst.instrumento!.id == instrumento.id);
    if (actual != undefined) {
      const { id, nombre, tipoTrabajadorId, tipoEvaluacionId } = actual.instrumento!;
      const instruments: Instrumento = { id: id, nombre: nombre, tipoTrabajadorId: tipoTrabajadorId, tipoEvaluacionId: tipoEvaluacionId };
      this.instrumentoActualSignal.set(instruments);
    }
  }

  handleChange(inst: Instrumento, event: Event) {
    this.isSubmitting.set(true);
    this.asignarInstrumento(inst);
    this.addInstrumentoPeriodo(inst, event).finally(() => {
        this.isSubmitting.set(false);
    });
  }
  
  addInstrumentoPeriodo(instrumento: Instrumento, event: Event) : Promise<void> {
    const radio = event.target as HTMLInputElement;
    if(radio.type === "radio"){
      if(radio.checked){
        const InstrumentoExiste = this.instrumentosAdd().find((dato) => dato.instrumento!.tipoTrabajadorId == instrumento.tipoEvaluacionId)!;

        const periodoxInstrumento:PeriodoxInstrumento = {instrumentoId: instrumento.id, periodoId: this.periodo().id, instrumento:instrumento}

        if(InstrumentoExiste != undefined)
        {
          this.updatePeriodoxIntrumento(InstrumentoExiste.periodoId, InstrumentoExiste.instrumentoId, periodoxInstrumento);
          this.instrumentosAdd.update((valor) => {
            return valor.map((dato) => dato.instrumentoId == InstrumentoExiste.instrumentoId && dato.periodoId == InstrumentoExiste.periodoId ? {...dato, instrumentoId: periodoxInstrumento.instrumentoId, periodoId: periodoxInstrumento.periodoId} : dato)
          })
        }
        else{
          this.addPeriodoxIntrumento(periodoxInstrumento);
          if(this.instrumentosAdd().length > 0)
          {
            this.instrumentosAdd.update((valor) => {
              return [...valor, periodoxInstrumento]
            })
          }
          else{
            this.instrumentosAdd.set([periodoxInstrumento])
          }
        }
      }
    }
    return Promise.resolve();
  }

  updatePeriodoxIntrumento(periodoId:number, instrumentoId: number, periodoxInstrumento:PeriodoxInstrumento){
    const datos:PeriodoxInstrumento = {periodoId: periodoxInstrumento.periodoId, instrumentoId: periodoxInstrumento.instrumentoId} 
    this.periodoxinstrumentoService.update(periodoId, instrumentoId, datos).subscribe({
      next: (response) => {
      }
    })
  }

  addPeriodoxIntrumento(periodoxInstrumento:PeriodoxInstrumento){
    const datos:PeriodoxInstrumento = {periodoId: periodoxInstrumento.periodoId, instrumentoId: periodoxInstrumento.instrumentoId} 
    this.periodoxinstrumentoService.post(datos).subscribe({
      next: (response) => {
        
      }
    })
  }

}
