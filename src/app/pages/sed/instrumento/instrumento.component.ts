import { Component, ViewChild, inject } from '@angular/core';
import { TitleComponent } from '../../../shared/title/title.component';
import { ModalService } from '../../../Services/modal.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ModalDeleteComponent } from '../../../components/modal-delete/modal-delete.component';
import { ModalInterface } from 'flowbite';

@Component({
  selector: 'app-instrumento',
  standalone: true,
  imports: [TitleComponent, ModalDeleteComponent, ReactiveFormsModule],
  templateUrl: './instrumento.component.html',
  styleUrl: './instrumento.component.css'
})
export default class InstrumentoComponent {

  modalService = inject(ModalService);
  matSnackBar=inject(MatSnackBar);
  fb = inject(FormBuilder);

  //Instancia del Modal
  modalActivo!: ModalInterface;

  PostType?:string;
  text:string = 'Agregar';  

  escalaForm = this.fb.group({
    id : [''],
    nombre: [''], // Transforma 'nombre' a 'titulo'
    simbologia: [''],
    valoracion: [''],
    nivelcumplimiento: ['']
  });

  //Componente Modal de Eliminar
  @ViewChild(ModalDeleteComponent) modal!: ModalDeleteComponent;

  openModal()
  {
    this.text = 'Agregar';
    this.PostType = 'add';
    this.modalActivo = this.modalService.createModal();
    this.modalActivo.show();
  }
  onSubmit(){

  }
  onDelete(event: any){

  }
  closeModal(){
    this.modalActivo.hide();
  }
}
