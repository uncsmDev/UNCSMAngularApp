import { Component, inject, Input, output, viewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {  DepOut, TreeDependencia } from '@interfaces/dependencia';
import { DependenciaService } from '@services/admin/dependencia.service';
import { ModalService } from '@services/modal.service';
import { SweetalertService } from '@services/sweetalert.service';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dependencias-tree',
  templateUrl: './dependencias-tree.component.html',
  styleUrl: './dependencias-tree.component.css',
  imports: []
})
export class DependenciasTreeComponent {

  modalService = inject(ModalService);
  matSnackBar=inject(MatSnackBar);
  fb = inject(FormBuilder);

  dependenciaService=inject(DependenciaService);
  sweetalert = inject(SweetalertService);

  @Input() tree: TreeDependencia[] = [];

  DepEmit= output<DepOut>();

  mostrarContenido(id: number) {
    const element = document.getElementById('display-' + id);
    const flecha = document.getElementById('flecha-' + id);

    const value = element?.classList.contains('mostrar-contenido');
    if (element) {
      if(value){
        element?.classList.remove('mostrar-contenido');
        element?.classList.add('ocultar-contenido');
        flecha?.classList.add('rotate-0');
        flecha?.classList.remove('rotate-180');
        
      }else{
        element?.classList.add('mostrar-contenido');
        element?.classList.remove('ocultar-contenido');
        flecha?.classList.add('rotate-180');
        flecha?.classList.remove('rotate-0');
      }
    }
  }

  OpenModalCargos(id: number) {
  }
  
  OpenAddModal(id:number)
  {
    const Dep: DepOut= {id: id, dependencia: '', type: 'add'}

    this.DepEmit.emit(Dep);
  }
  OpenEditModal(input: TreeDependencia) {
    const Dep: DepOut= {id: input.id, dependencia: input.nombre, type: 'edit'}

    this.DepEmit.emit(Dep);
  }
  OpenModalDeleteDependencia(id: number) {
  }
}

