import { CommonModule } from '@angular/common';
import { Component, inject, signal, viewChild, type OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Dependencia, DependenciaList } from '@interfaces/dependencia';
import { Paginacion } from '@interfaces/packPage';
import { DependenciaService } from '@services/admin/dependencia.service';
import { TitleComponent } from 'app/shared/title/title.component';
import { CargosModalComponent } from './cargos-modal/cargos-modal.component';

@Component({
  selector: 'app-asignacion-evaluacio',
  standalone: true,
  imports: [
    CommonModule, TitleComponent, RouterLink, CargosModalComponent
  ],
  templateUrl: './asignacion-evaluacio.component.html',
  styleUrl: './asignacion-evaluacio.component.css',
})
export default class AsignacionEvaluacioComponent implements OnInit {

  dependenciaService=inject(DependenciaService)
  pag!:Paginacion;
  fb = inject(FormBuilder);
  dependencias = signal<DependenciaList[]>([]);
  dependenciasOriginal = signal<DependenciaList[]>([]);
  modalCargo = viewChild.required(CargosModalComponent)
  entidadForm=this.fb.group({
    id : [''],
    dni: [''],
    codigo: ['000000'],
    nombres: [''],
    apellidos : [''],
    fechaIngreso : [''],
    sexoId: [''],
    cargoId: [''],
    dependenciaId: [''],
     
  });

  GetListIndex(pag:number)
  {
   this.searchDependencias(pag, '');
  }

  searchDependencias(pag:number, dependencia: string){
    this.dependenciaService.getPagination(pag, dependencia).subscribe({
      next: (res)=> {
        this.pag=res.paginacion;
        this.dependencias.set(
         res.listModel
       );
       this.dependenciasOriginal.set(
         res.listModel
       );
      },
      error: (error) =>{
        console.error(error);
      }
    });
  }
  openModal(item: DependenciaList){
    this.modalCargo().openModal(item);
  }

  handlerSearch(texto: KeyboardEvent){
    if (texto.key === 'Enter') {
    //Mejorar
    const textoEvento = texto.target as HTMLInputElement;
    const value = textoEvento.value;
    this.searchDependencias(0, value.toLowerCase())
    }
  }

  ngOnInit(): void {
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

  
}
