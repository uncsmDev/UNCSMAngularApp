import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepOut, TreeDependencia } from '@interfaces/dependencia';
import { ResultEnum } from '@interfaces/Result.interface';
import { tipoModal } from '@interfaces/trabajador';
import { DependenciaService } from '@services/admin/dependencia.service';
import { ModalService } from '@services/modal.service';
import { SweetalertService } from '@services/sweetalert.service';
import { ModalInterface } from 'flowbite';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-edit-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './add-edit-modal.component.html',
  styleUrl: './add-edit-modal.component.css'
})

export class AddEditModalComponent {

  typeInput:string = 'add';

   sweetalert = inject(SweetalertService);
   dependenciaService=inject(DependenciaService);

  modalActivo!: ModalInterface;
  fb = inject(FormBuilder);
  modalService = inject(ModalService);

  dependenciaForm = this.fb.group({
    dependenciaId: [0],
    nombre: ['', Validators.required]
  });

  outModal= output<TreeDependencia>();

  openModal(input:DepOut) 
  {

    if(this.typeInput == input.type)
    {
      this.dependenciaForm.controls['dependenciaId'].setValue(input.id);

      this.modalActivo = this.modalService.createModal('add-edit-modal');
      this.modalActivo.show();
    }
    else
    {
      this.typeInput = input.type;
      this.dependenciaForm.controls['dependenciaId'].setValue(input.id);
      this.dependenciaForm.controls['nombre'].setValue(input.dependencia);

      this.modalActivo = this.modalService.createModal('add-edit-modal');
      this.modalActivo.show();
    }
  }

  closeModal()
  {
    this.typeInput = 'add';
    this.dependenciaForm.reset();
    this.modalActivo.hide();
    this.modalActivo.destroy();

    //location.reload();
  }

 async onSubmit()
  {
    console.log(this.typeInput);
    if(this.typeInput == 'add')
    {
      const res= await firstValueFrom(this.dependenciaService.saveByDependenciaId(this.dependenciaForm.value as DepOut));
       
      if(res.status == ResultEnum.Success)
      {
        const dep= res.data as TreeDependencia;
        
        this.outModal.emit(dep);

        this.closeModal();

         Swal.fire({
                      title: 'Advertencia!',
                      html: '<p>Se guardo correctamente.</p>',
                      icon: 'success',
                      confirmButtonText: 'Ok',
                      ...this.sweetalert.theme,
                    });
      }

      else
      {
         Swal.fire({
                      title: 'Advertencia!',
                      html: '<p>'+res.message+'.</p>',
                      icon: 'warning',
                      confirmButtonText: 'Ok',
                      ...this.sweetalert.theme,
                    });
      }
    }

    else
    {
      const resUp= await firstValueFrom(this.dependenciaService.updateName(this.dependenciaForm.value as DepOut));
       
      if(resUp.status == ResultEnum.Success)
      {
      
        const dep= resUp.data as TreeDependencia;
        
        this.outModal.emit(dep);


        this.closeModal();
        Swal.fire({
          title: 'Advertencia!',
          html: '<p>Se guardo correctamente.</p>',
          icon: 'success',
          confirmButtonText: 'Ok',
          ...this.sweetalert.theme,
        });
      }
      else
      {
        Swal.fire({
          title: 'Advertencia!',
          html: '<p>'+resUp.message+'.</p>',
          icon: 'warning',
          confirmButtonText: 'Ok',
          ...this.sweetalert.theme,
        });
      }
  }
  }
}
