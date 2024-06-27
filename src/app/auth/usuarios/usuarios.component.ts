import { Component, Signal, WritableSignal, computed, inject, signal,AfterViewInit, ViewChild, AfterContentInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { UsuarioService } from '../../Services/usuario.service';
import { UsuarioViewModel, Usuario } from '../../interfaces/usuario';
import {PackPage, Paginacion} from '../../interfaces/packPage'
import type { InstanceOptions, ModalInterface } from 'flowbite';

import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { every, map, Observable, startWith } from 'rxjs';
import { ModalService } from '@services/modal.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule,FormBuilder, ReactiveFormsModule, FormControl } from '@angular/forms';
import { ModuloService } from '@services/modulo.service';
import { SubmoduloService } from '@services/submodulo.service';
import { Modulo, ModuloSelectView } from '@interfaces/modulo';
import { SubModulo, SubModuloViewer, SubModuloXUser, SubModuloXUserView } from '@interfaces/submodulo';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ModalDeleteComponent } from 'app/components/modal-delete/modal-delete.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { AsyncPipe } from '@angular/common';
import { Repuesta } from '@interfaces/Repuesta';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule,ReactiveFormsModule,MatAutocompleteModule,MatFormFieldModule,
    ModalDeleteComponent,FormsModule,MatInputModule,AsyncPipe],
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

  subModulosByUser:WritableSignal<SubModuloXUserView[]>=signal([]);
  subModuloByUserList:Signal<SubModuloXUserView[]>=computed(this.subModulosByUser);
  
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


  @ViewChild('inputRef') inputElement: any;
  
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
    this.SBMxUForm.controls['subModuloId'].setValue(parseInt(event.option.value.id));
    this.SBMxUForm.controls['ApsNetUserId'].setValue( this.userInModal.id);
  
    const subModuloUserInsert: SubModuloXUser=this.SBMxUForm.value as SubModuloXUser;
    this.SubmoduloService.insertSubModuloXUsuario(subModuloUserInsert).subscribe({
      next:(res)=>{
     
        if(res.status=Repuesta.Created)
          {
            this.inputElement.nativeElement.value = '';
            this.matSnackBar.open('Guardado exitoso: ' + res.message,'Cerrar',{ duration:5000, horizontalPosition:'center'});

            this.GetListSubModuloByUserId(this.userInModal.id,this.pagSM.paginaInicio);
          
          }
        else {
          this.GetListSubModuloByUserId(this.userInModal.id,this.pagSM.paginaInicio);
          this.matSnackBar.open(res.message) ;
          this.inputElement.nativeElement.value = '';
        } 
      },
      error: (error) => { 

        if(error.error.errors.ConfirmPassword!=null)
          this.matSnackBar.open('Algo salio mal','Cerrar',{ duration:5000, horizontalPosition:'center'})}
    });

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
          subModuloId:item.subModuloId,
          ApsNetUserId:item.ApsNetUserId,
          moduloId:item.moduloId,
          subModulo:item.subModulo
        }));
        this.subModulosByUser.set(listSMU);
      }
    });
  }

  GetListSubModuloByUserIdFilterIdModulo(idUser:string,PagSubM:number,idModuloF:number)
  {
    this.SubmoduloService.getSubModuloListByUser(idUser,PagSubM).subscribe({
      next:(rsmu)=>{

        this.pagSM=rsmu.paginacion;

        const listSMU=rsmu.listModel.map(item=>({
          id:item.id,
          subModuloId:item.subModuloId,
          ApsNetUserId:item.ApsNetUserId,
          moduloId:item.moduloId,
          subModulo:item.subModulo
        }));
        this.subModulosByUser.set(listSMU.filter(lsmu=>lsmu.moduloId==idModuloF));
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
    this.GetListSubModuloByUserId( this.userInModal.id,1);
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
   // this.GetListSubModuloByUserIdFilterIdModulo(this.userInModal.id,1,parseInt(this.valIdModuloSelect));
  }

  onSubmitSM()
  {
  }

  deleteSubModuloXUsuario(SMU:SubModuloXUserView)
  {
    this.SubmoduloService.deleteSubModuloXUsuario(SMU.id).subscribe({
      next:(rs)=>{
        this.matSnackBar.open( rs.message,'Cerrar',{ duration:5000, horizontalPosition:'center'});

        this.GetListSubModuloByUserId(this.userInModal.id,this.pagSM.paginaInicio);
      }, 
      error: (error) =>{ console.error("Error", error);
      }
    });
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
