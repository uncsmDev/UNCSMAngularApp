import { Component, inject, output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ResultEnum } from '@interfaces/Result.interface';
import { InsertUsuario } from '@interfaces/usuario';
import { ModalService } from '@services/modal.service';
import { UsuarioService } from '@services/usuario.service';
import { ModalInterface } from 'flowbite';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-usuarios-crear',
  imports: [ReactiveFormsModule],
  templateUrl: './usuarios-crear.component.html',
  styleUrl: './usuarios-crear.component.css'
})
export class UsuariosCrearComponent {

  modalActivo!: ModalInterface;
  fb = inject(FormBuilder);
  modalService = inject(ModalService);
  usuarioService=inject(UsuarioService);

  showPassword: boolean = false;
  showPasswordRe: boolean = false;

  nombreCompleto!:string;

  emailOutput= output<boolean>();

  insertForm = this.fb.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
    personaId: [0],
    telefono: new FormControl(''),
  })

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  togglePasswordVisibilityRe() {
    this.showPasswordRe = !this.showPasswordRe;
  }

  openModal(IdPersona: number, trabajador:string)
  {
    //this.contratoForm.controls['id'].setValue(inputData);

    this.insertForm.controls['personaId'].setValue(IdPersona);

    this.nombreCompleto=trabajador;
   
    this.modalActivo = this.modalService.createModal('CreateUserModal');
    this.modalActivo.show();
  }

  async onSubmit()
  {
    if (this.insertForm.invalid) {
      this.insertForm.markAllAsTouched();
    }
    else
    {
      const UserInput=this.insertForm.value as unknown  as InsertUsuario;

      const resp=await firstValueFrom(this.usuarioService.registerUser(UserInput));

      this.emailOutput.emit(true);

      /*if(resp.status==ResultEnum.Success)
      {
        this.closeModal();
      }*/
    }

    
  }

  closeModal()
  {
    this.modalActivo.hide();
    this.modalActivo.destroy();
  }

}
