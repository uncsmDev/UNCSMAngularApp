import { CommonModule } from '@angular/common';
import { Component, inject, signal, type OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CargoList } from '@interfaces/cargo';
import { Paginacion } from '@interfaces/packPage';
import { CargoService } from '@services/admin/cargo.service';
import { TitleComponent } from 'app/shared/title/title.component';

@Component({
  selector: 'app-asignacion-evaluacio',
  standalone: true,
  imports: [
    CommonModule, TitleComponent, RouterLink
  ],
  templateUrl: './asignacion-evaluacio.component.html',
  styleUrl: './asignacion-evaluacio.component.css',
})
export default class AsignacionEvaluacioComponent implements OnInit {

  cargoService=inject(CargoService)
  pag!:Paginacion;
  fb = inject(FormBuilder);
  cargos = signal<CargoList[]>([]);
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
   this.cargoService.getPagination(pag).subscribe({
     next: (res)=> {
       this.pag=res.paginacion;
       this.cargos.set(
        res.listModel
      );
     },
     error: (error) =>{
       console.error(error);
     }
   });
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
