import { initFlowbite } from 'flowbite';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { PaisService } from '../Services/pais.service';
import { Pais } from '../interfaces/pais';
import { SidemenuComponent } from '../shared/sidemenu/sidemenu.component';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, SidemenuComponent, HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export default class ModulosComponent {

  router = inject(Router);
  pais = inject(PaisService);

  paises: Pais[] = [];

  ngOnInit() {
    initFlowbite();
    this.pais.get().subscribe({
      next: (resp: Pais[]) => {
        this.paises = resp;
        //console.log(this.paises);
      },
      error: (error) => {
        console.error("Error", error);
      }
    });
  }

  ir(){
    console.log('Entra');
    this.router.navigate(['modulos/sed']);
  }


}
