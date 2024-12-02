import { Component, inject, OnInit, output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ResultEnum } from '@interfaces/Result.interface';
import { ModalService } from '@services/modal.service';
import { ModalInterface } from 'flowbite';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import { SweetalertService } from '@services/sweetalert.service';
import { UsuarioService } from '@services/usuario.service';

@Component({
  selector: 'app-usuario-reset-email-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './usuario-reset-email-modal.component.html',
  styleUrl: './usuario-reset-email-modal.component.css'
})
export class UsuarioResetEmailModalComponent {

  sweetalert = inject(SweetalertService);
  usuarioService=inject(UsuarioService);

  modalActivo!: ModalInterface;
  fb = inject(FormBuilder);
  modalService = inject(ModalService);

  emailOutput= output<string>()

  formResetEmail= this.fb.group({
    email: [''],
    reEmail: ['']
  })

  openModal(email:string)
  {
    this.reset()

    this.formResetEmail.controls['email'].setValue(email);
    this.modalActivo = this.modalService.createModal('chageEmailModal');
    this.modalActivo.show();
  }

  reset()
  {}

   async OnSubmit()
  {
    if(this.formResetEmail.invalid)
    {
      Swal.fire({
        title: 'Advertencia!',
        html: '<p>Hay campos que no han sido completados.</p>',
        icon: 'warning',
        confirmButtonText: 'Ok',
        ...this.sweetalert.theme,
      });
      this.formResetEmail.markAllAsTouched();
    }

    else
    {
      const emailInput=this.formResetEmail.value as unknown  as {email:string, reEmail:string}

    var resp=await firstValueFrom(this.usuarioService.ChangeEmail(emailInput.email,emailInput.reEmail));


      if (resp.status == ResultEnum.Success) {
        Swal.fire({
          title: 'Advertencia!',
          html: '<p>El Correo se Reseteo Correctamente</p>',
          icon: 'success',
          confirmButtonText: 'Ok',
          ...this.sweetalert.theme,
        });
        this.emailOutput.emit(emailInput.reEmail);
        this.closeModal();
      }
      else {
        Swal.fire({
          title: 'Advertencia!',
          html: '<p>' + resp.message + '</p>',
          icon: 'warning',
          confirmButtonText: 'Ok',
          ...this.sweetalert.theme,
        })
      }
    }
    
  }

  closeModal()
  {
    this.modalActivo.hide();
    this.modalActivo.destroy();
  }
}
