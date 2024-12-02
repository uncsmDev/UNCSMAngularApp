import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ResultEnum } from '@interfaces/Result.interface';
import { UserDto } from '@interfaces/usuario';
import { ModalService } from '@services/modal.service';
import { SweetalertService } from '@services/sweetalert.service';
import { UsuarioService } from '@services/usuario.service';
import { ModalInterface } from 'flowbite';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario-reset-pass-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './usuario-reset-pass-modal.component.html',
  styleUrl: './usuario-reset-pass-modal.component.css'
})
export class UsuarioResetPassModalComponent {

  sweetalert = inject(SweetalertService);
  usuarioService=inject(UsuarioService);


  modalActivo!: ModalInterface;
  fb = inject(FormBuilder);
  modalService = inject(ModalService);

  UserForm=this.fb.group({

    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
  })

  openModal( email: string)
  {
    this.reset();

    this.UserForm.controls['email'].setValue(email);

    this.modalActivo = this.modalService.createModal('resetPassModal');
    this.modalActivo.show();
  }

  reset()
  {}


  showPassword: boolean = false;
  showPasswordRe: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  togglePasswordVisibilityRe() {
    this.showPasswordRe = !this.showPasswordRe;
  }

  async onSubmit()
  {
    if(this.UserForm.invalid)
    {
      Swal.fire({
        title: 'Advertencia!',
        html: '<p>Hay campos que no han sido completados.</p>',
        icon: 'warning',
        confirmButtonText: 'Ok',
        ...this.sweetalert.theme,
      });
      this.UserForm.markAllAsTouched();
    }
  
    const UserInput=this.UserForm.value as unknown  as UserDto;

    var resp=await firstValueFrom(this.usuarioService.ResetPassword(UserInput));

    if(resp.status==ResultEnum.Success)
    {
      Swal.fire({
        title: 'Advertencia!',
        html: '<p>La Contraseña se Reseteo Correctamente</p>',
        icon: 'success',
        confirmButtonText: 'Ok',
        ...this.sweetalert.theme,
      });

      this.closeModal();
    }
    else
    {
      Swal.fire({
        title: 'Advertencia!',
        html: '<p>'+resp.message+'</p>',
        icon: 'warning',
        confirmButtonText: 'Ok',
        ...this.sweetalert.theme,
      });
    }
  }

  closeModal()
  {
    this.modalActivo.hide();
    this.modalActivo.destroy();
  }
}
