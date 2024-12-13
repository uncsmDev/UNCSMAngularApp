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


@Component({
    selector: 'app-escala',
    imports: [TitleComponent, ReactiveFormsModule, ModalDeleteComponent,DependenciasTreeComponent,AddEditModalComponent],
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
}

