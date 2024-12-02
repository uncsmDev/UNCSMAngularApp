import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ResultEnum } from '@interfaces/Result.interface';
import { ContratoService } from '@services/admin/contrato.service';
import { ModalService } from '@services/modal.service';
import { SweetalertService } from '@services/sweetalert.service';
import { ModalInterface } from 'flowbite';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-finaliza-contrato',
  imports: [ReactiveFormsModule],
  templateUrl: './finaliza-contrato.component.html',
  styleUrl: './finaliza-contrato.component.css'
})
export class FinalizaContratoComponent {

  modalActivo!: ModalInterface;
  fb = inject(FormBuilder);
  modalService = inject(ModalService);
  contratoService=inject(ContratoService);
  sweetalert = inject(SweetalertService);

  inputForm = this.fb.group({
    contratoId: [0, [Validators.required]]
  });

  EstadoC= output<boolean>();


  openFinModal(contratoId: number) {

    this.inputForm.controls['contratoId'].setValue(contratoId);

    this.modalActivo = this.modalService.createModal('finalizaContratoModal');
    this.modalActivo.show();
  }

  async onSumit() {

    if (this.inputForm.invalid) {
      console.log(this.inputForm.value);
    }
    else
    {
      const idContrato =  this.inputForm.controls['contratoId'].value as number;   //his.inputForm.get('contratoId')?.value;
   
      const cr = await firstValueFrom(this.contratoService.FinalizaContrato(idContrato));

      if(cr.status==ResultEnum.Success)
      {
        this.EstadoC.emit(true);
        this.closeModal();
        
      }
      else 
      {
        Swal.fire({
          title: 'Advertencia!',
          html: '<p>No se pudo finalizar el contrato</p>',
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
