import { Component, inject, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TreeDependencia } from '@interfaces/dependencia';
import { ResultEnum } from '@interfaces/Result.interface';
import { DependenciaService } from '@services/admin/dependencia.service';
import { ModalService } from '@services/modal.service';
import { SweetalertService } from '@services/sweetalert.service';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dependencias-tree',
  imports: [],
  templateUrl: './dependencias-tree.component.html',
  styleUrl: './dependencias-tree.component.css'
})
export class DependenciasTreeComponent {

  modalService = inject(ModalService);
  matSnackBar=inject(MatSnackBar);
  fb = inject(FormBuilder);

  dependenciaService=inject(DependenciaService);
  sweetalert = inject(SweetalertService);

  @Input() tree: TreeDependencia[] = [];

}
