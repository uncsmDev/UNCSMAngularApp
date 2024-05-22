import { ModuloService } from '../Services/modulo.service';
import { Modulo } from '../interfaces/modulo';
import { Component, WritableSignal, inject, signal } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { initFlowbite } from 'flowbite';
import { FooterComponent } from '../shared/footer/footer.component';
import { SpinnerComponent } from '../shared/spinner/spinner.component';
import { delay } from 'rxjs';
import { RouterLink } from '@angular/router';
import { TitleComponent } from '../shared/title/title.component';

@Component({
  selector: 'app-mod',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, SpinnerComponent, RouterLink, TitleComponent],
  templateUrl: './mod.component.html',
  styleUrl: './mod.component.css'
})
export default class ModComponent {

  moduloService = inject(ModuloService);

  modulos: WritableSignal<Modulo[]> = signal([]);

  constructor(){
    
  }

  ngOnInit() {
    initFlowbite();
    this.moduloService.get()
    
    .subscribe({
      next: (resp)=> {
        debugger
        const mod = resp.map(item => ({
          id: item.id,
          titulo: item.titulo, // Transforma 'nombre' a 'titulo'
          descripcion: item.descripcion,
          path: item.path,
          loadComponent: item.loadComponent,
          imgLocation: item.imgLocation,
          subModulos: null,
        }));

        this.modulos.set(mod);
        console.log(this.modulos());
      },
      error: (error) =>{
        console.error("Error", error);
      }
    })
  }

}
