import { Component, Signal, WritableSignal, computed, inject, signal,AfterViewInit, ViewChild, AfterContentInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import {PackPage, Paginacion} from '../../../interfaces/packPage'
import type { InstanceOptions } from 'flowbite';

import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { Observable } from 'rxjs';
import { Entidad } from '../../../interfaces/entidad';
import { EntidadService } from '../../../Services/admin/entidad.service';
import { TitleComponent } from '../../../shared/title/title.component';


@Component({
    selector: 'app-entidad',
    standalone: true,
    templateUrl: './entidad.component.html',
    styleUrl: './entidad.component.css',
    imports: [MatTableModule, MatPaginatorModule, TitleComponent]
})
export default class EntidadComponent {

  entidadService=inject(EntidadService)

  entidades:WritableSignal<Entidad[]>=signal([]);
  entidadList:Signal<Entidad[]>=computed(this.entidades);

  pag!:Paginacion;


  constructor()
  {
  
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

}
