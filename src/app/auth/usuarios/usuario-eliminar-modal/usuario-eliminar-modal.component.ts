import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ResultEnum } from '@interfaces/Result.interface';
import { ModalService } from '@services/modal.service';
import { SweetalertService } from '@services/sweetalert.service';
import { UsuarioService } from '@services/usuario.service';
import { ModalInterface } from 'flowbite';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario-eliminar-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './usuario-eliminar-modal.component.html',
  styleUrl: './usuario-eliminar-modal.component.css'
})
export class UsuarioEliminarModalComponent {

  modalActivo!: ModalInterface;
  fb = inject(FormBuilder);

  modalService = inject(ModalService);
  sweetalert = inject(SweetalertService);
  usuarioService=inject(UsuarioService);

  emailForm = this.fb.group({
    email: ['']
  })

  emailOutput= output<boolean>();

  openModal(email: string)
  {
    this.reset()

    this.emailForm.controls['email'].setValue(email);
    this.modalActivo = this.modalService.createModal('delUserModlal');
    this.modalActivo.show();
  }


  async onSumit() 
  {
    if(this.emailForm.invalid)
      {
        Swal.fire({
          title: 'Advertencia!',
          html: '<p>No se establecieron los datos correctamente</p>',
          icon: 'warning',
          confirmButtonText: 'Ok',
          ...this.sweetalert.theme,
        })
      }

      const em= this.emailForm.value as unknown as {email:string}

      var outPut= await firstValueFrom( this.usuarioService.DeleteUser(em.email));
     
      if(outPut.status==ResultEnum.Success)
      {
        this.emailOutput.emit(true);
        this.closeModal();
      }
        
      else 
      {
        Swal.fire({
          title: 'Advertencia!',
          html: '<p>'+outPut.message+'.</p>',
          icon: 'warning',
          confirmButtonText: 'Ok',
          ...this.sweetalert.theme,
        })
      }

  }

  reset()
  {
    this.emailForm.reset();
  }

  closeModal()
  {
    this.modalActivo.hide();
    this.modalActivo.destroy();
  }

}
