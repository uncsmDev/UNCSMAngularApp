import { TipoEvaluacion } from '@interfaces/tipo_evaluacion';
import { Component, inject, input, output, signal, viewChild } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Instrumento, tipoModal } from '@interfaces/instrumento';
import { InstrumentoService } from '@services/sed/instrumento.service';
import { ModalInterface } from 'flowbite';
import { ModalService } from '@services/modal.service';
import { EmiterResult } from '@interfaces/EmiterResult';
import { TipoTrabajadorService } from '@services/admin/tipoTrabajador.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { TipoEvaluacionesService } from '@services/sed/TipoEvaluaciones.service';

@Component({
  selector: 'app-modal-instrumento',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './modal-instrumento.component.html',
  styleUrl: './modal-instrumento.component.css'
})
export class ModalInstrumentoComponent {
  modalActivo!: ModalInterface;
  fb = inject(FormBuilder);
  modalService = inject(ModalService);
  tipoTrabajadorSvc = inject(TipoTrabajadorService);
  tipoEvaluacionSvc = inject(TipoEvaluacionesService);

  instrumentoService = inject(InstrumentoService)

  tipoTrabajadorId = input.required<number>();
  tipoEvaluacionId = input.required<number>();

  tipoTrabajadores$ = this.tipoTrabajadorSvc.get();
  tipoTrabajadores = toSignal(this.tipoTrabajadores$);
  
  tipoEvaluacion$ = this.tipoEvaluacionSvc.get();
  tipoEvaluacion = toSignal(this.tipoEvaluacion$);

  instrumentoForm = this.fb.group({
    id: [0, [Validators.required]],
    nombre: ['', [Validators.required]]
  });

  PostType = input.required<tipoModal>();
  text:string = 'Agregar';

  outputPostType = output<EmiterResult<Instrumento | null>>();

  onSubmit(){
    if(this.instrumentoForm.valid)
    {
         const instrumento: Instrumento = this.instrumentoForm.value as Instrumento;
         instrumento.tipoEvaluacionId = this.tipoEvaluacionId();
         instrumento.tipoTrabajadorId = this.tipoTrabajadorId();

         if(this.PostType() == 'add')
          {
            this.instrumentoService.post(instrumento).subscribe({
              next: a => {
                if(a.data != null)
                {
                  this.outputPostType.emit({typeModal: this.PostType(), data: a.data})
                  this.reset();
                  this.closeModal();
                }
                else{
                  this.outputPostType.emit({typeModal: this.PostType(), data: null})
                }
              },
              error: (e) => {
                this.outputPostType.emit({typeModal: this.PostType(), data: null})
              }
            });
        }
        else{
          this.instrumentoService.put(instrumento).subscribe({
            next: (res) =>{
              if(res){
                this.reset();
                this.closeModal();
                this.outputPostType.emit({typeModal: this.PostType(), data: res.data})
              }
              else{
                this.outputPostType.emit({typeModal: this.PostType(), data: null})
              }
            },
            error: (err)=>{
              this.outputPostType.emit({typeModal: this.PostType(), data: null})
            }
          })
          
        }
        
         
    }     
  }

  closeModal(){
    this.modalActivo.hide();
  }

  reset()
  {
    this.instrumentoForm.reset(
      {
        id: 0,
        nombre: ''
      }
    );
  }

  openModal()
  {
    this.reset()

    this.text = 'Agregar';
    this.modalActivo = this.modalService.createModal('static-modal');
    this.modalActivo.show();
  }

  openModalEdit(inst: Instrumento | null)
  {
    this.text = 'Editar';
    this.instrumentoForm.controls['id'].setValue(inst!.id);
    this.instrumentoForm.controls['nombre'].setValue(inst!.nombre);
    this.modalActivo = this.modalService.createModal('static-modal');
    this.modalActivo.show();
  }
}

