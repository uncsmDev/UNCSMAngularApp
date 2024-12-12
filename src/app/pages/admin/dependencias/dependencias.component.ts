import { Component,  inject} from '@angular/core';
import { TitleComponent } from '../../../shared/title/title.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalDeleteComponent } from '../../../components/modal-delete/modal-delete.component';
import { ModalService } from '../../../Services/modal.service';
import { ModalInterface } from 'flowbite';
import { TreeDataComponent } from './treeData/treeData.component';
import { DependenciaService } from '@services/admin/dependencia.service';
import {  TreeDependencia } from '@interfaces/dependencia';
import { firstValueFrom } from 'rxjs';
import { ResultEnum } from '@interfaces/Result.interface';
import Swal from 'sweetalert2';
import { SweetalertService } from '@services/sweetalert.service';
import { DependenciasTreeComponent } from './dependencias-tree/dependencias-tree.component';


@Component({
    selector: 'app-escala',
    imports: [TitleComponent, ReactiveFormsModule, ModalDeleteComponent, TreeDataComponent,DependenciasTreeComponent],
    templateUrl: './dependencias.component.html',
    styleUrl: './dependencias.component.css'
})
export default class DependenciaComponent {
  //Componentes Injectados

  modalService = inject(ModalService);
  matSnackBar=inject(MatSnackBar);
  fb = inject(FormBuilder);

  dependenciaService=inject(DependenciaService);
  sweetalert = inject(SweetalertService);

  //Instancia del Modal
  modalActivo!: ModalInterface;


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

  openModal()
  {
    /*this.escalaForm.reset();

    this.modalActivo = this.modalService.createModal('static-modal');
    this.modalActivo.show();*/
  }

  closeModal(){
    this.modalActivo.hide();
  }
  
}

