import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { Paginacion } from '@interfaces/packPage';
import { Trabajador } from '@interfaces/trabajador';
import { TrabajadorService } from '@services/admin/trabajador.service';
import { TitleComponent } from 'app/shared/title/title.component';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-trabajador',
  standalone: true,
  imports: [TitleComponent],
  templateUrl: './trabajador.component.html',
  styleUrl: './trabajador.component.css'
})
export default class TrabajadorComponent {

  trabajadorService=inject(TrabajadorService);

  trabajadores:WritableSignal<Trabajador[]>=signal([]);
  trabajadorList:Signal<Trabajador[]>=computed(this.trabajadores);


  ngOnInit(): void {
    initFlowbite();
    this.GetListIndex(0);
  }
  
  constructor(private router: Router) { }
  //-------------- Paginacion datos ---------------------------
  paginacion!:Paginacion;
  

  //-------------- GetLists Inicio ---------------------------
  GetListIndex(Pagina:number)
  {
    this.trabajadorService.getList(Pagina).subscribe(
      {
        next: (data) => {
          this.paginacion=data.paginacion;
          this.trabajadores.set(data.listModel);
        }
      }
    );
  }

  GetListWithFilter(Pag:number,filterText:string)
  {
    this.trabajadorService.getListWithFilter(Pag,filterText).subscribe({
      next: (data) => {
        this.paginacion=data.paginacion;
        this.trabajadores.set(data.listModel);
      }      
    });
  }

  //-------------- GetLists Fin ---------------------------

  //-------------- Paginacion Search ---------------------------
  handlerSearch(texto: KeyboardEvent){
    if (texto.key === 'Enter') 
    {
      const textoEvento = texto.target as HTMLInputElement;
      const value = textoEvento.value;

      if(value=="")
        return this.GetListIndex(0);
   
      this.GetListWithFilter(0,value);
    }
  }


   //-------------- Paginacion Inicio ---------------------------
  previousPage() 
  {
    var valueInput = document.getElementById("table-search") as HTMLInputElement;
    if (valueInput.value == "")
    {
      if (this.paginacion.paginasAnteriores == true) 
      {
        this.GetListIndex(this.paginacion.paginaInicio - 1);
      }
    }
    else 
      this.GetListWithFilter(this.paginacion.paginaInicio - 1,valueInput.value);
  }

   nextPage()
   {
    var valueInput = document.getElementById("table-search") as HTMLInputElement;
    if (valueInput.value == "")
    {
      if(this.paginacion.paginasPosteriores==true)
        {
          this.GetListIndex(this.paginacion.paginaInicio+1);
        }
    }
    else  this.GetListWithFilter(this.paginacion.paginaInicio + 1,valueInput.value);
     
   }
 
   //---------------Paginacion fin --------------------------------
   

   irInputTrabajador() {
    this.router.navigate(['/admin/trabajador/nuevo-trabajador']);
  }

  irPerfil(Id:number) {
    //trabajador/perfil/:id
    this.router.navigate(['/admin/trabajador/perfil',Id]);
  }

}
