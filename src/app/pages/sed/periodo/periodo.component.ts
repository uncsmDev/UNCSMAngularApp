import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tipoModal } from '@interfaces/instrumento';
import { Periodo } from '@interfaces/periodo';
import { ModalService } from '@services/modal.service';
import { PeriodoService } from '@services/sed/periodo.service';
import { ModalDeleteComponent } from 'app/components/modal-delete/modal-delete.component';
import { TitleComponent } from 'app/shared/title/title.component';
import { ModalInterface } from 'flowbite';

@Component({
  selector: 'app-periodo',
  standalone: true,
  imports: [
    CommonModule, TitleComponent, ReactiveFormsModule, ModalDeleteComponent
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

  periodoForm = this.formBuilder.group({
    id: [0],
    nombre: ['', Validators.required],
    fechaInicio: [new Date(), Validators.required],
    fechaFin: [new Date(), Validators.required]
  });

  text = 'Agregar';

  PostType: tipoModal = 'add'
  modalActivo!: ModalInterface;

  periodos = signal<Periodo[]>([])
  periodo = signal<Periodo>({
    id: 0,
    nombre: '',
    fechaInicio: new Date(),
    fechaFin: new Date()
})

  ModalDelete = viewChild(ModalDeleteComponent);

  ngOnInit() {
    this.getPeriodo();
  }

  getPeriodo(){
    this.periodoService.get().subscribe({
      next: (result) => {
        const data = result.data!;
        this.periodos.set(data);
      }
    })
  }
  
  openModal()
  {
    this.periodoForm.reset();
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
  }

  closeModal(){
    this.modalActivo.hide();
  }

  openModalEdit(periodo: Periodo, typeModal: string)
  {
    this.periodoForm.reset();
    this.text = 'Editar';
    this.PostType = 'edit';
    this.periodoForm.controls['id'].setValue(periodo.id);
    this.periodoForm.controls['nombre'].setValue(''+periodo.nombre);
    this.periodoForm.controls['fechaInicio'].setValue(periodo.fechaInicio);
    this.periodoForm.controls['fechaFin'].setValue(periodo.fechaFin);
    this.modalActivo = this.modalService.createModal('static-modal');
    this.modalActivo.show();
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
      next: (result) => {

        this.matSnackBar.open("Dato guardado correctamente",'Cerrar',{ duration:5000, horizontalPosition:'center'});
        this.periodoForm.reset();
      },
      error: (error) => { this.matSnackBar.open("Error al guardar los datos",'Cerrar',{ duration:5000, horizontalPosition:'center'}) }
    });
  }

  edit(){
    const periodo: Periodo = this.periodoForm.value as Periodo;

    this.periodoService.put(periodo).subscribe({
      next: (response) => {
        this.matSnackBar.open("Dato modificado correctamente",'Cerrar',{ duration:5000, horizontalPosition:'center'}).afterDismissed().subscribe({
          next:(result) =>{
            
          }
        })
        this.periodoForm.reset();
        this.closeModal()
      },
      error: (error) => {this.matSnackBar.open("Error al modificar los datos",'Cerrar',{ duration:5000, horizontalPosition:'center'}) }
    });
  }

  onDelete(event: any){

  }

}
