import { Component, computed, inject, output, Signal, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Cargo } from '@interfaces/cargo';
import { Dependencia } from '@interfaces/dependencia';
import { TipoContrato } from '@interfaces/tipo_contrato';
import { CargoService } from '@services/admin/cargo.service';
import { DependenciaService } from '@services/admin/dependencia.service';
import { TipoContratoService } from '@services/admin/tipoContrato.service';
import { ModalService } from '@services/modal.service';
import { initFlowbite, ModalInterface } from 'flowbite';
import { tipoModal} from '@interfaces/trabajador';
import { ContratoService } from '@services/admin/contrato.service';
import { Contrato } from '@interfaces/Contrato.interface';
import { ResultEnum } from '@interfaces/Result.interface';
import { SweetalertService } from '@services/sweetalert.service';
import Swal from 'sweetalert2';


@Component({
    selector: 'app-add-contrato-modal',
    imports: [ReactiveFormsModule, MatInputModule, MatSelectModule, MatFormFieldModule, MatAutocompleteModule],
    templateUrl: './add-contrato-modal.component.html',
    styleUrl: './add-contrato-modal.component.css'
})
export class AddContratoModalComponent {

  modalActivo!: ModalInterface;
  fb = inject(FormBuilder);
  modalService = inject(ModalService);

  dependenciaService=inject(DependenciaService);
  cargoService=inject(CargoService);
  tipoContratoService=inject(TipoContratoService);
  contratoService=inject(ContratoService);
  sweetalert = inject(SweetalertService);

  dependencias:WritableSignal<Dependencia[]>=signal([]);
  dependenciaList:Signal<Dependencia[]>=computed(this.dependencias);
  tipoContratos:WritableSignal<TipoContrato[]>=signal([]);
  tipoContratoList:Signal<TipoContrato[]>=computed(this.tipoContratos);

  cargos:WritableSignal<Cargo[]>=signal([]);
  cargoList:Signal<Cargo[]>=computed(this.cargos);
  cargosOrig:WritableSignal<Cargo[]>=signal([]);

  cargoIdControl = new FormControl('');

  valOutput= output<boolean>();
  contratoInput:Contrato={} as Contrato;

  ngOnInit(): void 
  {
    initFlowbite();
    this.GetListDependencia();
    this.GetListTipoContrato();
  }

  contratoForm = this.fb.group
  ({
    id: [0],//trabajador
    dependenciaId: new FormControl('', Validators.required),
    cargoId: new FormControl('', Validators.required),  //cargo por dependencia
    tipoContratoId: new FormControl('', Validators.required),
    fechaInicio: new FormControl('', Validators.required),
    fechaFin: new FormControl(''),
  });


  displayFnC(subject:any)
  {
    return subject? subject.nombre:undefined;
  }
  
  GetListDependencia()
  {
    this.dependenciaService.getList()
    .subscribe({
      next:(rd)=>{
        const listaDe=rd.map(item=>({
          id:item.id,
          nombre:item.nombre,
          dependenciaId:item.dependenciaId,
          objDependencia:item.objDependencia
        }));
    
        this.dependencias.set(listaDe);
      }
    });
  }

  GetListCargo(Pagina:number,DependenciaId:number,Filter:string)
  {
    this.cargoService.getListByDependenciaIdWithFilter(Pagina,DependenciaId,Filter)
    .subscribe({
      next:(re)=>{
        const listaCargo=re.listModel.map(item=>({
          id:item.id,
          nombre:item.nombre,
          descripcion:item.descripcion,
          CargoXDependencia:item.cargoXDependencias

        }));
        this.cargos.set(listaCargo);
        this.cargosOrig.set(listaCargo);
      }
    });
  }

  GetListTipoContrato()
  {
    this.tipoContratoService.getList().subscribe({
      next:(tc)=>{
        const listTC=tc.data.map(item=>({
          id:item.id,
          nombre:item.nombre
        }));

        this.tipoContratos.set(listTC);
      }
    })
  }

  onSelectedDependencia(event: Event)
  {
    this.cargoIdControl.setValue('');
    var valueInput = (event.target as HTMLSelectElement).value;
    this.GetListCargo(1,parseInt(valueInput),'');
  }

  filterCargos(event: any): void 
  {
    const input = (event.target.value as string).toLocaleLowerCase();
    this.cargos.set(this.cargosOrig().filter(ca => ca.nombre.toLowerCase().includes(input)));
  }

  onSelectCargo(event:any)
  {
    this.contratoForm.controls['cargoId'].setValue(event.option.value.id);
  }

  displayFn(subject:any)
  {
    return subject? subject.titulo:undefined;
  }

  PostType:tipoModal = 'add';


  openModal(inputData:number)
  {
    this.GetListTipoContrato();
    this.GetListDependencia();

    this.contratoForm.controls['id'].setValue(inputData);

    this.PostType = 'add';
    this.modalActivo = this.modalService.createModal('addcontratoModal');
    this.modalActivo.show();
  }


  onSubmit()
  {

    //2022-01-01 //this.SBMxUForm.controls['subModuloId'].setValue(parseInt(event.option.value.id));

    this.contratoForm.controls['fechaFin'].setValue(this.contratoForm.controls['fechaFin'].value==''?null:this.contratoForm.controls['fechaFin'].value);

    if(this.contratoForm.invalid)
    {
      Swal.fire({
        title: 'Advertencia!',
        html: '<p>Hay campos que no han sido completados.</p>',
        icon: 'warning',
        confirmButtonText: 'Ok',
        ...this.sweetalert.theme,
      })
      this.contratoForm.markAllAsTouched();
    }

    this.contratoInput= this.contratoForm.value as unknown  as Contrato;
    this.contratoService.Create(this.contratoInput).subscribe({
      next:(data)=>{
        if(data.status ==ResultEnum.Success)
          {

            this.closeModal();
          }
          else
          {
            Swal.fire({
              title: 'Advertencia!',
              html: '<p>'+data.message+'.</p>',
              icon: 'warning',
              confirmButtonText: 'Ok',
              ...this.sweetalert.theme,
            })
          }
      }
    });

    this.valOutput.emit(true);
  }

  closeModal()
  {
    this.modalActivo.hide();
    this.modalActivo.destroy();
  }
}
