import { CommonModule } from '@angular/common';
import { Component, inject, input, output, signal, type OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Instrumento } from '@interfaces/instrumento';
import { Periodo, PeriodoxInstrumento } from '@interfaces/periodo';
import { TipoEntidad } from '@interfaces/tipoEntidad';
import { TipoEntidadService } from '@services/admin/tipoEntidad.service';
import { ModalService } from '@services/modal.service';
import { InstrumentoService } from '@services/sed/instrumento.service';
import { PeriodoxinstrumentoService } from '@services/sed/periodoxinstrumento.service';
import { ModalInterface } from 'flowbite';

@Component({
  selector: 'app-instrumento-add-modal',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './instrumento-add-modal.component.html',
  styleUrl: './instrumento-add-modal.component.css',
})
export class InstrumentoAddModalComponent {

  modalActivo!: ModalInterface;
  private fb = inject(FormBuilder);
  private modalService = inject(ModalService);
  private periodoxinstrumentoService = inject(PeriodoxinstrumentoService)

  private tipoEntidadService = inject(TipoEntidadService);
  private instrumentoService = inject(InstrumentoService);
  tipoEntidadesSignal = signal<TipoEntidad[]>([]);
  tipoEntidadIdSignal = signal(0);
  public instrumentosAdd = signal<PeriodoxInstrumento[]>([])
  public periodo = signal<Periodo>({id: 0, fechaFin: '', fechaInicio: '', nombre: ''})
  instrumentoActualSignal = signal<Instrumento>({id:0, nombre:'',tipoEntidadId:0})
  text:string = 'Agregar';

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
    this.instrumentoService.getInstrumentoxEntidad(Number(selectedValue)).subscribe({
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
    return this.instrumentosAdd().some((inst) => inst.instrumento.id == instrumento.id);
  }
  
  asignarInstrumento(instrumento: Instrumento): void {
    const actual = this.instrumentosAdd().find((inst) => inst.instrumento.id == instrumento.id);
    if (actual != undefined) {
      const { id, nombre, tipoEntidadId } = actual.instrumento;
      const instruments: Instrumento = { id: id, nombre: nombre, tipoEntidadId: tipoEntidadId };
      this.instrumentoActualSignal.set(instruments);
    }
  }

  handleChange(inst: Instrumento, event: Event) {
    this.asignarInstrumento(inst);
    this.addInstrumentoPeriodo(inst, event);
  }
  addInstrumentoPeriodo(instrumento: Instrumento, event: Event){
    debugger
    const radio = event.target as HTMLInputElement;
    if(radio.type === "radio"){
      if(radio.checked){
        
        const InstrumentoExiste = this.instrumentosAdd().find((dato) => dato.instrumento.tipoEntidadId == instrumento.tipoEntidadId)!;

        this.periodoxinstrumentoService.del(InstrumentoExiste).subscribe({
          next: (resp) => {
            console.log(resp);
          }
        })
      }
    }
    
  }

}
