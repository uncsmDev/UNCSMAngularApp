import { Component, computed, inject, output, Signal, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { EstadoCivil } from '@interfaces/estado.civil';
import { Municipio } from '@interfaces/municipio';
import { Pais } from '@interfaces/pais';
import { ResultEnum } from '@interfaces/Result.interface';
import { Sexo } from '@interfaces/sexo';
import { InformacionPersonal } from '@interfaces/Updates/datosPersonalesInput ';
import { DepartamentoService } from '@services/admin/departamento.service';
import { EstadoCivilService } from '@services/admin/estado.civil.service';
import { MunicipioService } from '@services/admin/municipio.service';
import { SexoService } from '@services/admin/sexo.service';
import { TrabajadorService } from '@services/admin/trabajador.service';
import { ModalService } from '@services/modal.service';
import { PaisService } from '@services/pais.service';
import { FdropzoneComponent } from 'app/shared/input/fdropzone/fdropzone.component';
import { ModalInterface } from 'flowbite';

@Component({
    selector: 'app-trabajador-info-personal-modal',
    imports: [ReactiveFormsModule, FdropzoneComponent],
    templateUrl: './trabajador-info-personal-modal.component.html',
    styleUrl: './trabajador-info-personal-modal.component.css'
})
export class TrabajadorInfoPersonalModalComponent {

  sexoService=inject(SexoService);
  estadoCivilService=inject(EstadoCivilService);
  paisSevice=inject(PaisService);
  departamentoService=inject(DepartamentoService);
  municipioService=inject(MunicipioService);

  trabajadorService=inject(TrabajadorService);

  paises:WritableSignal<Pais[]>=signal([]);
  paisList:Signal<Pais[]>=computed(this.paises);
  departementos:WritableSignal<any[]>=signal([]);
  departamentoList:Signal<any[]>=computed(this.departementos);
  municipios:WritableSignal<any[]>=signal([]);
  municipioList:Signal<any[]>=computed(this.municipios);

  modalActivo!: ModalInterface;
  modalService = inject(ModalService);
  text:string = 'Agregar';

  infoEmit=output<InformacionPersonal>();
  refresh = output();

  fb = inject(FormBuilder);
  fc = inject(FormBuilder);

  sexos:WritableSignal<Sexo[]>=signal([]);
  sexoList:Signal<Sexo[]>=computed(this.sexos);
  estadoCivils:WritableSignal<EstadoCivil[]>=signal([]);
  estadoCivilList:Signal<EstadoCivil[]>=computed(this.estadoCivils);

  InfoPersonal:InformacionPersonal = {} as InformacionPersonal

  ubicacionForm = this.fc.group
  ({
    paisId: new FormControl(1),
    departamentoId: new FormControl(1),
  });

  infoPersonalForm=this.fb.group
  ({
    id: [1],
    estadoCivilId: new FormControl(1, Validators.required),
    sexoId: new FormControl(1, Validators.required),
    municipioId: new FormControl(1, Validators.required),
    direccion: new FormControl('', Validators.required),
    telefono1: new FormControl('', Validators.required),
    telefono2: new FormControl(''),
    correoPersonal: new FormControl('', Validators.required),
  });

  openModal(inputData:InformacionPersonal)
  {
    this.GetListPais();
    this.GetListSexo();
    this.GetListEstadoCivil();
    this.GetListDepartamento();
    this.GetListMunicipio();
  
    this.infoPersonalForm.patchValue(inputData);
        
    /*this.ubicacionForm.setControl('departamentoId', new FormControl(inputData.departamentoId));
    this.ubicacionForm.setControl('paisId', new FormControl(inputData.paisId));*/
  
 
    this.ubicacionForm.setValue(
      {
        paisId: inputData.paisId,
        departamentoId: inputData.departamentoId
      });
 
    this.text = 'Edit';
    this.modalActivo = this.modalService.createModal('infoP-modal');
    this.modalActivo.show();
  }

  onSelectedPais(event: Event)
  {
    var valueInput = (event.target as HTMLSelectElement).value;

    this.departamentoService.getListByPaisId(1,parseInt(valueInput)).subscribe({
      next: (data) => {
        this.departementos.set(data.listModel);
      }
    })
  }
 
  onSelectedDepartamento(event: Event)
  {
    var valueInput = (event.target as HTMLSelectElement).value;

    this.municipioService.getListByDepartamentoId(1,parseInt(valueInput)).subscribe({
      next: (data) => {
        this.municipios.set(data.listModel);
      }
    })
  }

  GetListMunicipio()
  {
    this.municipioService.getList(1)
    .subscribe({
      next:(rd)=>{
        const listaMun=rd.listModel.map(item=>({
          id:item.id,
          nombre:item.nombre
        }));
    
        this.municipios.set(listaMun);
      }
    });
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
  GetListDepartamento()
  {
    this.departamentoService.getList(1)
    .subscribe({
      next:(rd)=>{
        const listaDep=rd.listModel.map(item=>({
          id:item.id,
          nombre:item.nombre
        }));
    
        this.departementos.set(listaDep);
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

  GetListPais()
  {
    this.paisSevice.getList()
    .subscribe({
      next:(rd)=>{
        const listaPais=rd.listModel.map(item=>({
          id:item.id,
          nombre:item.nombre
        }));
    
        this.paises.set(listaPais);
      }
    });
  }
  closeModal()
  {
    this.modalActivo.hide();
    this.modalActivo.destroy();
    this.refresh.emit();
  }

  onSubmit()
  { 
    if(this.infoPersonalForm.valid)
    {
      this.InfoPersonal = this.infoPersonalForm.value as unknown as InformacionPersonal;

      this.trabajadorService.UpdateInfoData(this.InfoPersonal)
      .subscribe({
        next:(rd)=>{
          if(rd.status==ResultEnum.Success)
          {
            this.infoEmit.emit(this.InfoPersonal);
            this.modalActivo.hide();
            this.modalActivo.destroy();
          }
          else
          {
            console.log(rd.message);
          }
         
        }
      });
    }
    else
    {
      this.infoPersonalForm.markAllAsTouched();
    }
  }

}