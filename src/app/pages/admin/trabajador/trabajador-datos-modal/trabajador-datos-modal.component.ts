import { Component, computed, inject, input, output, Signal, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { tipoModal, Trabajador } from '@interfaces/trabajador';
import { ModalService } from '@services/modal.service';
import { FdropzoneComponent } from 'app/shared/input/fdropzone/fdropzone.component';
import { ModalInterface } from 'flowbite';
import { ArchivoService } from '@services/admin/archivo.service';
import { DatosPersonalesInput, InformacionPersonal } from '@interfaces/Updates/datosPersonalesInput ';
import { SafeUrl } from '@angular/platform-browser';
import { TrabajadorService } from '@services/admin/trabajador.service';
import { ResultEnum } from '@interfaces/Result.interface';
import { SexoService } from '@services/admin/sexo.service';
import { EstadoCivilService } from '@services/admin/estado.civil.service';
import { Sexo } from '@interfaces/sexo';
import { EstadoCivil } from '@interfaces/estado.civil';

@Component({
  selector: 'app-trabajador-datos-modal',
  standalone: true,
  imports: [ReactiveFormsModule,FdropzoneComponent],
  templateUrl: './trabajador-datos-modal.component.html',
  styleUrl: './trabajador-datos-modal.component.css'
})
export class TrabajadorDatosModalComponent {

  archivoService=inject(ArchivoService);
  trabajadorService=inject(TrabajadorService);
  sexoService=inject(SexoService);
  estadoCivilService=inject(EstadoCivilService);

  sexos:WritableSignal<Sexo[]>=signal([]);
  sexoList:Signal<Sexo[]>=computed(this.sexos);
  estadoCivils:WritableSignal<EstadoCivil[]>=signal([]);
  estadoCivilList:Signal<EstadoCivil[]>=computed(this.estadoCivils);

  modalActivo!: ModalInterface;
  fb = inject(FormBuilder);
  modalService = inject(ModalService);

  refresh = output();

  PostType = input.required<tipoModal>();
  img = input.required<SafeUrl | null>();
  imgEmit = output<DatosPersonalesInput>();
  text:string = 'Agregar';
  imagen: string | ArrayBuffer = '';

  imgUrl: SafeUrl | undefined;
  datosPersonales: DatosPersonalesInput = {} as DatosPersonalesInput;

 personalDataform = this.fb.group
 ({
   id: [0],
   dni: new FormControl(''),
   nombres: new FormControl('', Validators.required),
   apellidos: new FormControl('', Validators.required),
   ins: new FormControl('0000', Validators.required),
   estadoCivilId: new FormControl(0, Validators.required),
   sexoId: new FormControl(0, Validators.required),
 });

  openModal(inputData:DatosPersonalesInput, image:SafeUrl | undefined)
  {
    this.reset()
    //this.datosPersonales = inputData;

    this.GetListEstadoCivil();
    this.GetListSexo();
    this.personalDataform.patchValue(inputData);

    this.text = 'Editar';
    this.modalActivo = this.modalService.createModal('static-modal');
    this.modalActivo.show();
  }

  closeModal()
  {
    this.modalActivo.hide();
    this.modalActivo.destroy();
    this.refresh.emit(); 
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


  actualizarimagen(imagen: string | ArrayBuffer){
   if(imagen != null)
    this.imagen = imagen;
  }
  onSubmit() 
  {
    if(this.personalDataform.invalid)
    {
      this.personalDataform.markAllAsTouched();
    }
    else 
    {
      this.datosPersonales = this.personalDataform.value as unknown as DatosPersonalesInput;
      this.trabajadorService.UpdatePersonalData(this.datosPersonales,this.archivoService.file).subscribe({
        next: (data) => {
          if(data.status==ResultEnum.Success)
          {
            this.datosPersonales.img = this.imagen;
            this.imgEmit.emit(this.datosPersonales);
            this.modalActivo.hide();
          }
          else
          {
            console.log(data.message);
          }
        
        },
        error: (error) => {
          console.log(error);
        }
      });

      this.modalActivo.hide();
    }
  }
  
  GetListSexo()
  {
    this.sexoService.getList()
    .subscribe({
      next:(rd)=>{
        const listaSex=rd.map(item=>({
          id:item.id,
          nombre:item.nombre
        }));
    
        this.sexos.set(listaSex);
      }
    });
  }

  GetListEstadoCivil()
  {
    this.estadoCivilService.getList()
    .subscribe({
      next:(rd)=>{
        const listaEst=rd.listModel.map(item=>({
          id:item.id,
          nombre:item.nombre
        }));
    
        this.estadoCivils.set(listaEst);
      }
    });
  }

}
