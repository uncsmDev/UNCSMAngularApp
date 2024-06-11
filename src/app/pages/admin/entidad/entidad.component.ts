import { Component, Signal, WritableSignal, computed, inject, signal,AfterViewInit, ViewChild, AfterContentInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import {PackPage, Paginacion} from '../../../interfaces/packPage'
import type { InstanceOptions } from 'flowbite';

import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

import { Observable } from 'rxjs';
import { Entidad, EntidadDto } from '../../../interfaces/entidad';
import { Cargo } from '../../../interfaces/cargo';
import { EntidadService } from '../../../Services/admin/entidad.service';
import { TitleComponent } from '../../../shared/title/title.component';

import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalDeleteComponent } from '../../../components/modal-delete/modal-delete.component';
import { ModalService } from '../../../Services/modal.service';
import { ModalInterface } from 'flowbite';
import { CargoService } from '../../../Services/admin/cargo.service';
import { TipoEntidadService } from '../../../Services/admin/tipoEntidad.service';
import { TipoEntidad } from '../../../interfaces/tipoEntidad';
import { Dependencia } from '../../../interfaces/dependencia';
import { DependenciaService } from '../../../Services/admin/dependencia.service';
import { Sexo } from '../../../interfaces/sexo';
import { SexoService } from '../../../Services/admin/sexo.service';


@Component({
    selector: 'app-entidad',
    standalone: true,
    templateUrl: './entidad.component.html',
    styleUrl: './entidad.component.css',
    imports: [MatTableModule, MatPaginatorModule, TitleComponent, ReactiveFormsModule, ModalDeleteComponent,MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule]
})
export default class EntidadComponent {

  entidadService=inject(EntidadService);
  cargoService=inject(CargoService)
  modalService = inject(ModalService);
  tipoEntidadService=inject(TipoEntidadService);
  dependenciaService=inject(DependenciaService);
  sexoService=inject(SexoService);

  matSnackBar=inject(MatSnackBar);
  fb = inject(FormBuilder);

  entidades:WritableSignal<Entidad[]>=signal([]);
  entidadList:Signal<Entidad[]>=computed(this.entidades);

  cargos:WritableSignal<Cargo[]>=signal([]);
  cargoList:Signal<Cargo[]>=computed(this.cargos);

  tiposEntidades:WritableSignal<TipoEntidad[]>=signal([]);
  tipoEntidadList:Signal<TipoEntidad[]>=computed(this.tiposEntidades);

  dependencias:WritableSignal<Dependencia[]>=signal([]);
  dependenciasList:Signal<Dependencia[]>=computed(this.dependencias);

  sexos:WritableSignal<Sexo[]>=signal([]);
  sexoList:Signal<Sexo[]>=computed(this.sexos);

  pag!:Paginacion;

  modalActivo!: ModalInterface;
  PostType?:string;
  text:string = 'Agregar';  

  modeloEntidad = signal<Entidad|null>(null);

  sexoIdF!:number;

  @ViewChild(ModalDeleteComponent) modal!: ModalDeleteComponent;

  
  entidadForm=this.fb.group({
    id : [''],
    dni: [''],
    codigo: ['000000'],
    nombres: [''],
    apellidos : [''],
    fechaIngreso : [''],
    sexoId: [''],
    cargoId: [''],
    tipoEntidadId : [''],
    dependenciaId: [''],
     
  });

  constructor()
  {
    
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

  GetListTipoEntidad()
  {
    this.tipoEntidadService.getList()
    .subscribe({
      next:(re)=>{
        const listaTE=re.map(item=>({
          id:item.id,
          nombre:item.nombre
        }));
    
        this.tiposEntidades.set(listaTE);
      }
    });
  }

  GetListCargo()
  {
    this.cargoService.getList()
    .subscribe({
      next:(re)=>{
        const listaCargo=re.map(item=>({
          id:item.id,
          nombre:item.nombre,
          descripcion:item.descripcion
        }));
        this.cargos.set(listaCargo);
      }
    });
  }

  GetListIndex(pag:number)
  {
   this.entidadService.getList(pag)
   .subscribe({
     next: (res)=> {

       this.pag=res.paginacion;

       const entidads=res.listModel.map(item=>({
         id:item.id,
         codigo :item.codigo,
         fechaIngreso:item.fechaIngreso,
         persona:item.persona,
         cargo: item.cargo,
         tipoEntidad: item.tipoEntidad,
         dependencia: item.dependencia
       }));
     
       this.entidades.set(entidads);
     
     },
     error: (error) =>{
       console.error("Error", error);
     }
   });
  }


  ngOnInit(): void {
    initFlowbite();
    this.GetListIndex(0);
  }

 //-------------- Paginacion Inicio ---------------------------
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

  //---------------Paginacion fin --------------------------------
  
 
  callChildMethod(modelo: Entidad) {
    if(this.modal){
      this.modal.openModal(); // Llama al método doSomething del componente hijo
    }
    this.modeloEntidad.set(modelo);
  }

  openModalEdit(entidad: Entidad, typeModal: string)
  {
    this.GetListCargo();
    this.GetListTipoEntidad();
    this.GetListDependencia();
    this.GetListSexo();
    this.text = 'Editar';
    this.PostType = 'edit';
    this.entidadForm.controls['id'].setValue(''+entidad.id);
    this.entidadForm.controls['dni'].setValue(''+entidad.persona?.dni);
    this.entidadForm.controls['codigo'].setValue(''+entidad.codigo);
    this.entidadForm.controls['nombres'].setValue(''+entidad.persona?.nombres);
    this.entidadForm.controls['apellidos'].setValue(''+entidad.persona?.apellidos);
    this.entidadForm.controls['fechaIngreso'].setValue(''+this.formatearFecha(new Date(entidad.fechaIngreso)));
    this.entidadForm.controls['sexoId'].setValue(''+entidad.persona?.sexoId);
  
   this.entidadForm.controls['cargoId'].setValue(''+entidad.cargo?.id);
    this.entidadForm.controls['tipoEntidadId'].setValue(''+entidad.tipoEntidad?.id);
    this.entidadForm.controls['dependenciaId'].setValue(''+entidad.dependencia?.id);
    this.modalActivo = this.modalService.createModal('static-modal');
    this.modalActivo.show();
  }

  formatearFecha(fechaString:Date) {
    const fecha = new Date(fechaString);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son base 0
    const anio = fecha.getFullYear();

    return `${anio}-${mes}-${dia}`;
}

  openModal()
  {
    this.GetListCargo();
    this.GetListTipoEntidad();
    this.GetListDependencia();
    this.GetListSexo();
    this.text = 'Agregar';
    this.PostType = 'add';
    this.modalActivo = this.modalService.createModal('static-modal');
    this.modalActivo.show();
  }

  
  closeModal(){
    this.entidadForm.reset();

    this.modalActivo.hide();
  }
  
 
  onSubmit(){

    if(this.PostType == 'add')
      {
    this.entidadService.post(this.entidadService.convertirAGrupoAObjeto(this.entidadForm)).subscribe({
      next: (response) => {
        this.matSnackBar.open("Dato guardado correctamente",'Cerrar',{ duration:5000, horizontalPosition:'center'});
        this.entidadForm.reset();
        this.GetListIndex(1);
      },
      error: (error) => { this.matSnackBar.open("Error al guardar los datos",'Cerrar',{ duration:5000, horizontalPosition:'center'}) }
    });
  }
    else{

      console.log(this.PostType+' <<<PostType');
      this.entidadService.put(this.entidadService.convertirAGrupoAObjeto(this.entidadForm)).subscribe({
        next: (response) => {
          this.matSnackBar.open("Dato modificado correctamente",'Cerrar',{ duration:5000, horizontalPosition:'center'}).afterDismissed().subscribe({
            next:(s) =>{
              
      console.log(' <<<OpenModal>>>');
              this.closeModal()
            }
          })
          this.GetListIndex(1);
        },
        error: (error) => {this.matSnackBar.open("Error al modificar los datos",'Cerrar',{ duration:5000, horizontalPosition:'center'}) }
      });
    }
  }

}

