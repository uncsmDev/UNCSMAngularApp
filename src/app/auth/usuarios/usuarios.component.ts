import { Component, Signal, WritableSignal, computed, inject, signal,AfterViewInit, ViewChild, AfterContentInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { UsuarioService } from '../../Services/usuario.service';
import { UsuarioViewModel, Usuario } from '../../interfaces/usuario';
import {PackPage, Paginacion} from '../../interfaces/packPage'
import type { InstanceOptions, ModalInterface } from 'flowbite';

import { Select2Data, Select2Module } from 'ng-select2-component';

import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { every, map, Observable, startWith } from 'rxjs';
import { ModalService } from '@services/modal.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule,FormBuilder, ReactiveFormsModule, FormControl } from '@angular/forms';
import { ModuloService } from '@services/modulo.service';
import { SubmoduloService } from '@services/submodulo.service';
import { Modulo, ModuloSelectView } from '@interfaces/modulo';
import { SubModulo, SubModuloViewer } from '@interfaces/submodulo';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ModalDeleteComponent } from 'app/components/modal-delete/modal-delete.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule,ReactiveFormsModule,Select2Module,MatAutocompleteModule,MatFormFieldModule,ModalDeleteComponent,FormsModule,MatInputModule,AsyncPipe],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})

export default class UsuariosComponent {
  userService =inject(UsuarioService);
  modalService = inject(ModalService);
  moduloService=inject(ModuloService);
  SubmoduloService=inject(SubmoduloService);

  //auntocomplete
  
  filteredOptions!: Observable<string[]>;
 
  control = new FormControl('');
  matSnackBar=inject(MatSnackBar);
  fb = inject(FormBuilder);

  modulos:WritableSignal<ModuloSelectView[]>=signal([]);
  moduloList:Signal<ModuloSelectView[]>=computed(this.modulos);

  subModulos:WritableSignal<SubModuloViewer[]>=signal([]);
  subModuloList:Signal<SubModuloViewer[]>=computed(this.subModulos);
  subModulosV!: SubModuloViewer[];
  searchValue!: string;

  subModulosByUser:WritableSignal<SubModulo[]>=signal([]);
  subModuloByUserList:Signal<SubModulo[]>=computed(this.subModulosByUser);
  
  selectedSubModulo!: SubModuloViewer;
  filteredSubModulos!: SubModuloViewer[];

  valIdModuloSelect!:string;
  idSubModuloSelct=0;
  
  usuarios:WritableSignal<UsuarioViewModel[]>=signal([]);
  usuarioList:Signal<UsuarioViewModel[]>=computed(this.usuarios);

  modalSubModulo!: ModalInterface;
  modalCreatemodalSubModulo!: ModalInterface;
  
  pag!:Paginacion;
  pagSM!:Paginacion;
  
  userInModal!:UsuarioViewModel;
  titulo!: ((value: any) => string)|null;
   constructor()
   {
   }

   SBMxUForm=this.fb.group({
    subModuloId : 0,
    ApsNetUserId: [''],
    moduloId: 0,
    nombres:[''],
    apellidos:[''],
  });

  onSelectSubModulo(event:any)
  {
   console.log('onSelectSubModulo Evento::: '+JSON.stringify(event.option.value.id));
  // this.idSubModuloSelct=parseInt(event.target.value);
  //this.SBMxUForm.get('subModuloId')?.value=parseInt(event.option.value);   //.control('subModuloId').set(event.option.value);
  /*  this.userForm.controls['apellidos'].setValue(''+model.persona?.apellidos);
    this.userForm.controls['entidadId'].setValue(model.id);
    this.userForm.get('nombres')?.disable();*/ 
    this.SBMxUForm.controls['subModuloId'].setValue(parseInt(event.option.value.id));
    this.SBMxUForm.controls['ApsNetUserId'].setValue( this.userInModal.id);
    console.log('Control::::  '+JSON.stringify(this.SBMxUForm.value));
  }

  displayFn(subject:any)
  {
    return subject? subject.titulo:undefined;
  }
  
  GetListModulos()
  {
    this.moduloService.getList().subscribe({
      next:(rm)=>{
        const listmodulo=rm.map(item=>({
          id:item.id,
          titulo:item.titulo
        }));
        this.modulos.set(listmodulo);
      }

    });
  }

  GetListSubModuloByUserId(idUser:string,PagSubM:number)
  {
    this.SubmoduloService.getSubModuloListByUser(idUser,PagSubM).subscribe({
      next:(rsmu)=>{

        this.pagSM=rsmu.paginacion;

        const listSMU=rsmu.listModel.map(item=>({
          id:item.id,
          titulo:item.titulo,
          descripcion: item.descripcion,
          path: item.path,
          icon:    item.icon,
          loadComponent:  item.loadComponent,
          moduloId:      item.moduloId,
          modulo: item.modulo,
        }));
        this.subModulosByUser.set(listSMU);
      }
    });
  }

  GetListSubModuloByIdMoulo(id:number,filter:string)//id Modulo
  {
   if(filter==null)
     filter='';

   this.SubmoduloService.getListByModulo(id,filter).subscribe({
     next:(rsm)=>{
       const listSM=rsm.map(item=>({ id:item.id,titulo:item.titulo}));
       this.subModulos.set(listSM);
       this.filteredSubModulos = this.subModulosV;
       this.subModulosV =rsm;
     this.filteredSubModulos = this.subModulosV;
     }
   });
  }
 
  GetListIndex(pag:number)
  {
   this.userService.get(pag)
   .subscribe({
     next: (res)=> {

       this.pag=res.paginacion;

       const users=res.listModel.map(item=>({
         id:item.id,
         nombres:item.nombres,
         apellidos:item.apellidos,
         email:item.email,
         cargo:item.cargo
       }));
     
       this.usuarios.set(users);
     
     },
     error: (error) =>{
       console.error("Error", error);
     }
   });
  }

  filterSubModulos(event:any): void 
  {
    this.GetListSubModuloByIdMoulo(parseInt(this.valIdModuloSelect),event.target.value);
  }

  ngOnInit(): void {
    initFlowbite();
    this.GetListIndex(0);
  }

  previousPage()
  {
    if(this.pag.paginasAnteriores==true)
      {
        this.GetListIndex(this.pag.paginaInicio-1);
      }
  }

  nextPage()
  {
    if(this.pag.paginasPosteriores==true)
    {
      this.GetListIndex(this.pag.paginaInicio+1);
    }
  }

  openModalSubModulosUser(user:UsuarioViewModel,modal:string)
  {
    //this.userForm.get('id')?.disable();
    this.userInModal=user;
    this.GetListModulos();
    this.GetListSubModuloByUserId(user.id,1);
    this.SBMxUForm.get('nombres')?.disable();
    this.SBMxUForm.get('apellidos')?.disable();
    this.SBMxUForm.get('subModuloId')?.disable();
    this.SBMxUForm.controls['nombres'].setValue(''+user.nombres);
    this.SBMxUForm.controls['apellidos'].setValue(''+user.apellidos);
   
    this.modalSubModulo = this.modalService.createModal('static-modal');
    this.modalSubModulo.show();
  }

  onSubmit()
  {
  }

  onSelectedModulo(event: Event)
  {
    this.SBMxUForm.get('subModuloId')?.enable();
    this.valIdModuloSelect = (event.target as HTMLSelectElement).value;

    console.log(this.valIdModuloSelect);
    this.GetListSubModuloByIdMoulo(parseInt(this.valIdModuloSelect),'');
  }

  onSubmitSM()
  {
  }

  closeModal()
  {
    this.modalSubModulo.hide();
  }

   //-------------- Paginacion Inicio ---------------------------
  previousPageModal()
   {
     if(this.pagSM.paginasAnteriores==true)
       {
        const idUser=this.SBMxUForm.get('ApsNetUserId')?.value?.toString();
        this.GetListSubModuloByUserId(this.userInModal.id,this.pagSM.paginaInicio-1);

         //this.GetListIndex(this.pagSM.paginaInicio-1);
       }
  }

  nextPageModal()
   {
     if(this.pagSM.paginasPosteriores==true)
       {
        this.GetListSubModuloByUserId(this.userInModal.id,this.pagSM.paginaInicio+1);
        
       }
  }
   //---------------Paginacion fin --------------------------------
}
