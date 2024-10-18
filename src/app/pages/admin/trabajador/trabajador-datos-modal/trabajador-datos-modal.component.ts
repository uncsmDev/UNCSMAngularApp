import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmiterResult } from '@interfaces/EmiterResult';
import { tipoModal, Trabajador } from '@interfaces/trabajador';
import { ModalService } from '@services/modal.service';
import { FdropzoneComponent } from 'app/shared/input/fdropzone/fdropzone.component';
import { ModalInterface } from 'flowbite';
import { ArchivoService } from '@services/admin/archivo.service';
import { DatosPersonalesInput } from '@interfaces/Updates/datosPersonalesInput ';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-trabajador-datos-modal',
  standalone: true,
  imports: [ReactiveFormsModule,FdropzoneComponent],
  templateUrl: './trabajador-datos-modal.component.html',
  styleUrl: './trabajador-datos-modal.component.css'
})
export class TrabajadorDatosModalComponent {

  archivoService=inject(ArchivoService);
  
  modalActivo!: ModalInterface;
  fb = inject(FormBuilder);
  modalService = inject(ModalService);

  PostType = input.required<tipoModal>();
  text:string = 'Agregar';

  imgUrl: SafeUrl | undefined;
 // outputPostType = output<EmiterResult<Trabajador>>();
  datosPersonales: DatosPersonalesInput = {} as DatosPersonalesInput;

 personalDataform = this.fb.group
 ({
   id: [0],
   dni: new FormControl(''),
   nombres: new FormControl('', Validators.required),
   apellidos: new FormControl('', Validators.required),
   ins: new FormControl('0000', Validators.required),
 });

  openModal(inputData:DatosPersonalesInput,image:SafeUrl | undefined)
  {
    this.reset()
    //this.datosPersonales = inputData;
  
    this.personalDataform.patchValue(inputData);

    this.text = 'Editar';
    this.modalActivo = this.modalService.createModal('static-modal');
    this.modalActivo.show();
  }

  closeModal()
  {
    this.modalActivo.hide();
    this.modalActivo.destroy();
  }

  reset()
  {
    this.personalDataform.reset(
      {
        id: 0,
        dni: '',
        nombres: '',
        apellidos: '',
        ins: ''
      }
    )
  }

  onSubmit() 
  {
    if(this.personalDataform.invalid)
    {
      this.personalDataform.markAllAsTouched();
    }
  }
  
}
