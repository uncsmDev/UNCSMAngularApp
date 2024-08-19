import { CommonModule, formatDate } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal, viewChild } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Instrumento, tipoModal } from '@interfaces/instrumento';
import { Periodo, PeriodoAddInstrumento, PeriodoxInstrumento } from '@interfaces/periodo';
import { ModalService } from '@services/modal.service';
import { PeriodoService } from '@services/sed/periodo.service';
import { ModalDeleteComponent } from 'app/components/modal-delete/modal-delete.component';
import { TitleComponent } from 'app/shared/title/title.component';
import { ModalInterface } from 'flowbite';
import { ListaInstrumentoComponent } from './ListaInstrumento/ListaInstrumento.component';
import { InstrumentoAddModalComponent } from './instrumento-add-modal/instrumento-add-modal.component';
import { PeriodoxinstrumentoService } from '@services/sed/periodoxinstrumento.service';

@Component({
  selector: 'app-periodo',
  standalone: true,
  imports: [
    CommonModule, TitleComponent, ReactiveFormsModule, ModalDeleteComponent, ListaInstrumentoComponent, InstrumentoAddModalComponent
  ],
  templateUrl: './periodo.component.html',
  styleUrl: './periodo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PeriodoComponent {

  formBuilder = inject(FormBuilder);
  modalService = inject(ModalService);
  matSnackBar=inject(MatSnackBar);
  periodoService = inject(PeriodoService);
  modalInstrumentoAdd = viewChild.required(InstrumentoAddModalComponent);
  periodoxinstrumentoService = inject(PeriodoxinstrumentoService)
  periodoForm = this.formBuilder.group({
    id: [0, Validators.required],
    nombre: ['', Validators.required],
    fechaInicio: [formatDate(new Date(), 'dd-MM-yyyy', 'en'), Validators.required],
    fechaFin: [formatDate(new Date(), 'dd-MM-yyyy', 'en'), Validators.required]
  });

  deletePeriodoSignal = signal(true);

  text = 'Agregar';

  PostType: tipoModal = 'add'
  modalActivo!: ModalInterface;

  periodos = signal<PeriodoAddInstrumento[]>([])
  periodo = signal<Periodo>(this.reset())
  isntrumentoDelete = signal<PeriodoxInstrumento>({periodoId:0, instrumentoId: 0})

  ModalDelete = viewChild(ModalDeleteComponent);

  ngOnInit() {
    this.getPeriodo();
  }

  reset(){
    return {
      id: 0,
      nombre: '',
      fechaInicio: '',
      fechaFin: ''
  }
  }

  getPeriodo(){
    this.periodoService.get().subscribe({
      next: (result) => {
        const data = result.data!;
        this.periodos.set(data);
      }
    })
  }


  deleteInstrumentPeriodo(){
    
    const peridodxInstrumento:PeriodoxInstrumento = {instrumentoId:this.isntrumentoDelete().instrumentoId, periodoId: this.isntrumentoDelete().periodoId}
    this.periodoxinstrumentoService.del(peridodxInstrumento).subscribe({
      next:(response) => {
        console.log(response);
        
        this.matSnackBar.open(response.message,'Cerrar',{ duration:5000, horizontalPosition:'center'});
      },
      error: (error)=> {
        this.matSnackBar.open("Error al eliminar el dato",'Cerrar',{ duration:5000, horizontalPosition:'center'})
      }
    })
  }

  openModal()
  {
    this.periodoForm.reset(this.reset());
    this.text = 'Agregar';
    this.PostType = 'add';
    this.modalActivo = this.modalService.createModal('static-modal');
    this.modalActivo.show();
  }

  callModalDelete(modelo: Periodo) {
    if(this.ModalDelete()){
      this.ModalDelete()!.openModal(); // Llama al método doSomething del componente hijo
    }
    
    this.periodo.set(modelo);
    this.deletePeriodoSignal.set(true)

  }

  callModalDeleteInstrumento(modelo: PeriodoxInstrumento) {
    if(this.ModalDelete()){
      this.ModalDelete()!.openModal(); // Llama al método doSomething del componente hijo
    }
    this.isntrumentoDelete.set(modelo)
    this.deletePeriodoSignal.set(false)
  }


  closeModal(){
    this.modalActivo.hide();
  }

  openModalEdit(periodo: Periodo, typeModal: string)
  {
    this.periodoForm.reset(this.reset());
    this.text = 'Editar';
    this.PostType = 'edit';

    const fechaInicio = this.conversionFecha(new Date(periodo.fechaInicio));
    const fechaFin = this.conversionFecha(new Date(periodo.fechaFin));

    console.log(fechaInicio)

    this.periodoForm.controls['id'].setValue(periodo.id);
    this.periodoForm.controls['nombre'].setValue(''+periodo.nombre);
    this.periodoForm.controls['fechaInicio'].setValue(fechaInicio);
    this.periodoForm.controls['fechaFin'].setValue(fechaFin);
    this.modalActivo = this.modalService.createModal('static-modal');
    this.modalActivo.show();
  }

  conversionFecha(fecha: Date){
    const day = String(fecha.getDate()).padStart(2, '0');
    const month = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son 0-indexados
    const year = fecha.getFullYear();

    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  }

  onSubmit(){

    if(this.PostType == 'add')
    {

      this.add();
    }
    else
    {
      this.edit();
    }
  }

  add()
  {
    const periodo: Periodo = this.periodoForm.value as Periodo;
    this.periodoService.post(periodo).subscribe({
      next: (response) => {
        this.getPeriodo();
        this.matSnackBar.open(response.message,'Cerrar',{ duration:5000, horizontalPosition:'center'});
        this.periodoForm.reset(this.reset());
      },
      error: (error) => { this.matSnackBar.open("Error al guardar los datos",'Cerrar',{ duration:5000, horizontalPosition:'center'}) }
    });
  }

  edit(){
    const periodo: Periodo = this.periodoForm.value as Periodo;

    this.periodoService.put(periodo).subscribe({
      next: (response) => {
        const data = response.data!;

        this.periodos.update((periodo) => {
          return periodo.map(p => p.id == data.id ? {...p, nombre: data.nombre, fechaInicio: data.fechaInicio, fechaFin: data.fechaFin} : p)
        })

        this.matSnackBar.open(response.message,'Cerrar',{ duration:5000, horizontalPosition:'center'}).afterDismissed().subscribe({
          next:(result) =>{

          }
        })
        this.periodoForm.reset(this.reset());
        this.closeModal()
      },
      error: (error) => {this.matSnackBar.open("Error al modificar los datos",'Cerrar',{ duration:5000, horizontalPosition:'center'}) }
    });
  }

  onDelete(){
    
    this.deletePeriodoSignal() ? this.deletePeriodo() : true;
  }

  deletePeriodo()
  {
    this.periodoService.delete(this.periodo()).subscribe({
      next: (response) => {
        this.periodos.update((periodo) => {
          return periodo.filter((p)=>
            {
              return p.id != this.periodo().id
            }
          )
        })

        this.matSnackBar.open(response.message,'Cerrar',{ duration:5000, horizontalPosition:'center'});
      },
      error: (error)=> {
        this.matSnackBar.open("Error al eliminar el dato",'Cerrar',{ duration:5000, horizontalPosition:'center'})
      }
    })
  }

  openModalInstrumentoAdd(instrumentosAdd: PeriodoxInstrumento[], periodo: Periodo){
    this.modalInstrumentoAdd().openModal(instrumentosAdd, periodo);
  }

validarFecha(fecha: string): boolean {
    const ahora = new Date();
    const fechaParametro = new Date(fecha);
    if (fechaParametro < ahora) {
      return false;
    }
    return true;
  }

}
