import { Component,  inject, viewChild} from '@angular/core';
import { TitleComponent } from '../../../shared/title/title.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalDeleteComponent } from '../../../components/modal-delete/modal-delete.component';
import { ModalService } from '../../../Services/modal.service';
import { ModalInterface } from 'flowbite';
import { DependenciaService } from '@services/admin/dependencia.service';
import {  DepOut, TreeDependencia } from '@interfaces/dependencia';
import { firstValueFrom } from 'rxjs';
import { ResultEnum } from '@interfaces/Result.interface';
import Swal from 'sweetalert2';
import { SweetalertService } from '@services/sweetalert.service';
import { DependenciasTreeComponent } from './dependencias-tree/dependencias-tree.component';
import { AddEditModalComponent } from './add-edit-modal/add-edit-modal.component';
import { CargosXDependenciaComponent } from '../cargos/cargos-xdependencia/cargos-xdependencia.component';


@Component({
    selector: 'app-escala',
    imports: [TitleComponent, ReactiveFormsModule, ModalDeleteComponent,DependenciasTreeComponent,AddEditModalComponent,CargosXDependenciaComponent],
    templateUrl: './dependencias.component.html',
    styleUrl: './dependencias.component.css'
})
export default class DependenciaComponent {
  //Componentes Injectados

  //Instancia del Modal
  modalActivo!: ModalInterface;
  modalService = inject(ModalService);
  matSnackBar=inject(MatSnackBar);
  fb = inject(FormBuilder);

  dependenciaService=inject(DependenciaService);
  sweetalert = inject(SweetalertService);

  modalDatos = viewChild.required(AddEditModalComponent);//
  modalCargos=viewChild.required(CargosXDependenciaComponent);

  tree: TreeDependencia[] = [];
  
  ngOnInit() {
 
    this.getRaiz();
  
  }

  async getRaiz()
  {
    const out= await firstValueFrom(this.dependenciaService.GetRaiz());

    if(out != null)
    {
      if(out.status==ResultEnum.Success)
      {
        this.tree=out.data;
      }
      else
      {
        Swal.fire({
          title: 'Advertencia!',
          html: '<p>'+out.message +'</p>',
          icon: 'warning',
          confirmButtonText: 'Ok',
          ...this.sweetalert.theme,
        })
      }
    }
  }

  searchTree(tree: any[], searchTerm: string, key: string = 'nombre'): TreeDependencia[] {
    const result: any[] = [];
  
    const search = (nodes: any[]) => {
      for (const node of nodes) {
        if (node[key] && node[key].toString().toLowerCase().includes(searchTerm.toLowerCase())) {
          result.push(node);
        }
        if (node.dependencias?.length) {
          search(node.dependencias);
        }
      }
    };
  
    search(tree);
  
    return result;
  }



  searchTreeDependenciaId(tree: any[],id: number): TreeDependencia[] {
    const result: any[] = [];
  
    const search = (nodes: TreeDependencia[]) => {
      for (const node of nodes) {
     
       if(node.dependenciaId==id)
        {
          result.push(node);
        }
        if (node.dependencias?.length) {
          search(node.dependencias);
        }
      }
    };
  
    search(tree);
  
    return result;
  }
  
  

  updateTree(inputModal:TreeDependencia)
  {
    //const find= this.tree.find(x=>x.id==inputModal.id);
    const findE = this.searchTree(this.tree, inputModal.id.toString(), 'id');
    
    if(findE.length>0)
    {
      findE[0].nombre=inputModal.nombre;
    }
    else
    {
      const parent=this.searchTree(this.tree, inputModal.dependenciaId!.toString(), 'id');

      if(parent.length!=0)
      {
        if(parent[0].dependencias.length==0)
        {
          parent[0].dependencias= [];
        }
        
        const insertDep: TreeDependencia ={
          id:inputModal.id, 
          nombre: inputModal.nombre, 
          dependenciaId: inputModal.dependenciaId, 
          dependencias: []};
        parent[0].dependencias.push(insertDep);
      }
      
    }


    ///this.tree = [];
    //this.getRaiz();
  }

  getDatos()
  {
  }
  
  onSubmit(){
  }
  onDelete(event: any)
  {
    
  }


  OpenAddModal(input: DepOut) {
    this.modalDatos().openModal(input);
  }  

  OpenAddModalCargos(id: number) {
    this.modalCargos().openModal(id);
  }
}

