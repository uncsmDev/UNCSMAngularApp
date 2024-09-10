import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
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
  
  constructor() { }

  paginacion!:Paginacion;
  
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

}
