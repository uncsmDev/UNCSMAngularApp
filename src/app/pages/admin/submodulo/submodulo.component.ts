import { Component, Signal, WritableSignal, computed, inject, signal,AfterViewInit, ViewChild, AfterContentInit } from '@angular/core';
import { initFlowbite } from 'flowbite';

import type { InstanceOptions, ModalInterface } from 'flowbite';
import { TitleComponent } from '../../../shared/title/title.component';
import { SubmoduloService } from '@services/submodulo.service';
import {PackPage, Paginacion} from '../../../interfaces/packPage'
import { SubModulo} from '@interfaces/submodulo';

import { ModalService } from '../../../Services/modal.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModuloService } from '@services/modulo.service';
import { ModuloSelectView } from '@interfaces/modulo';
import {FormsModule,FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ModalDeleteComponent } from 'app/components/modal-delete/modal-delete.component';

@Component({
  selector: 'app-submodulo',
  standalone: true,
  imports: [ TitleComponent, ModalDeleteComponent,ReactiveFormsModule, FormsModule],
  templateUrl: './submodulo.component.html',
  styleUrl: './submodulo.component.css'
})
export default class SubmoduloComponent {

  subModuloService=inject(SubmoduloService);
  modalService = inject(ModalService);
  moduloService=inject(ModuloService);

  matSnackBar=inject(MatSnackBar);
  fb = inject(FormBuilder);

  subModulos:WritableSignal<SubModulo[]>=signal([]);
  subModuloList:Signal<SubModulo[]>=computed(this.subModulos);

  modulos:WritableSignal<ModuloSelectView[]>=signal([]);
  moduloList:Signal<ModuloSelectView[]>=computed(this.modulos);

  pag!:Paginacion;
  
  PostType?:string;
  text:string = 'Agregar';  

  modalSubModulo!: ModalInterface;
  modalCreateSubModulo!: ModalInterface;

  @ViewChild(ModalDeleteComponent) modal!: ModalDeleteComponent;

  subModuloForm=this.fb.group({
    id : 0,
    titulo: [''],
    descripcion: [''],
    path: [''],
    loadComponent : [''],
    icon:[''],
    moduloId: 0,
  });

  GetListIndex(pag:number)
  {
   this.subModuloService.getList(pag)
   .subscribe({
     next: (res)=> {

       this.pag=res.paginacion;
       debugger;
       console.log(res.listModel);
       const subModuloslist=res.listModel.map(item=>({
         id:item.id,
         titulo :item.titulo,
         descripcion:item.descripcion,
         path:item.path,
         loadComponent: item.loadComponent,
         icon: item.icon,
         moduloId: item.moduloId,
         modulo:item.modulo
       }));
     
       this.subModulos.set(subModuloslist);
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

  constructor()
  {}

  GetListModulos()
  {
    this.moduloService.getList().subscribe({
      next:(rsm)=>{
        const listModulo=rsm.map(item=>({
          id:item.id,
          titulo: item.titulo
        }));
        this.modulos.set(listModulo);
      }
    });
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



   openModal()
   {
     this.GetListModulos();
     this.text = 'Agregar';
     this.PostType = 'add';
     this.modalSubModulo = this.modalService.createModal('static-modal');
     this.modalSubModulo.show();
   }
 
   onDelete(event: any)
   {
    this.subModuloService.eliminar().subscribe();
    /* this.entidadService.eliminar(this.modeloEntidad()).subscribe({
       next: (value) => {
         this.matSnackBar.open("Dato eliminado correctamente!",'Cerrar',{ duration:5000, horizontalPosition:'center'});
         this.GetListIndex(1);
       },
       error: (err) =>{
         this.matSnackBar.open("Error al eliminar el dato",'Cerrar',{ duration:5000, horizontalPosition:'center'})
       },
     })
     */
   }

   onSubmit()
   {

    const subModuloInsert: SubModulo=this.subModuloForm.value as SubModulo;

    if(this.PostType == 'add')
    {
      if(this.subModuloForm.valid)
        {
          this.subModuloService.post(subModuloInsert).subscribe({
            next:(rsm)=>{
              this.closeModal();
              this.matSnackBar.open("Dato guardado correctamente",'Cerrar',{ duration:5000, horizontalPosition:'center'});
              this.GetListIndex(1);
            },
            error: (error) => { this.matSnackBar.open("Error al guardar los datos",'Cerrar',{ duration:5000, horizontalPosition:'center'}) }
          })
        }
    }
    else{
      this.subModuloService.put(subModuloInsert).subscribe({
        next:(rsm)=>{
          this.closeModal();
          this.matSnackBar.open("Dato modificado correctamente",'Cerrar',{ duration:5000, horizontalPosition:'center'});
          this.GetListIndex(1);
        },
        error: (error) => {this.matSnackBar.open("Error al modificar los datos",'Cerrar',{ duration:5000, horizontalPosition:'center'}) }
      })
    }
   }

   closeModal(){
    this.subModuloForm.reset();

    this.modalSubModulo.hide();
  }

  openModalEdit(subModulo: SubModulo, typeModal: string)
  {
    this.GetListModulos();
    this.text = 'Editar';
    this.PostType = 'edit';

    this.subModuloForm.controls['id'].setValue(subModulo.id);
    this.subModuloForm.controls['titulo'].setValue(''+subModulo.titulo);
    this.subModuloForm.controls['descripcion'].setValue(''+subModulo.descripcion);
    this.subModuloForm.controls['path'].setValue(''+subModulo.path);
    this.subModuloForm.controls['loadComponent'].setValue(''+subModulo.loadComponent);
    this.subModuloForm.controls['icon'].setValue(''+subModulo.icon);
    this.subModuloForm.controls['moduloId'].setValue(subModulo.moduloId);
    
    this.modalSubModulo = this.modalService.createModal('static-modal');
    this.modalSubModulo.show();
  }
}
