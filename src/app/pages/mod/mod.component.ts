import { ModuloService } from '../../Services/modulo.service';
import { Modulo } from '../../interfaces/modulo';
import { Component, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { FooterComponent } from '../../shared/footer/footer.component';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { Router, RouterLink } from '@angular/router';
import { TitleComponent } from '../../shared/title/title.component';
import { HeaderDashboardComponent } from '../../shared/header-dashboard/header-dashboard.component';
import { NgOptimizedImage } from '@angular/common';
import { SpinnerGeneralComponent } from 'app/components/spinner/spinner.component';
import { catchError, throwError } from 'rxjs';

@Component({
    selector: 'app-mod',
    imports: [HeaderDashboardComponent, FooterComponent, SpinnerComponent, RouterLink, TitleComponent, NgOptimizedImage, SpinnerGeneralComponent],
    templateUrl: './mod.component.html',
    styleUrl: './mod.component.css'
})
export default class ModComponent {

  moduloService = inject(ModuloService);
  router = inject(Router);

  modulos: WritableSignal<Modulo[]> = signal([]);
  modulosNotEdit: Signal<Modulo[]> = computed(this.modulos);

  constructor(){
    
  }

  ngOnInit() {
    
    initFlowbite();
    this.moduloService.get().pipe(
      catchError((error: any) => {
        // Handle the error here
        console.error('An error occurred:', error);
        // Optionally, re-throw the error or return a default value
        return throwError('Something went wrong');
      })
    )
    .subscribe({
      next: (resp)=> {
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
      },
      error: (error) =>{
        console.error("Error", error);
      }
    })
  }

  link(path: string, id: number)
  {
    localStorage.setItem('moduloActual', JSON.stringify(id));
    this.router.navigate([path]);
  }

}
