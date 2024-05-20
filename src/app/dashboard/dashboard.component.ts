import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { PaisService } from '../Services/pais.service';
import { Pais } from '../interfaces/pais';
import { SidemenuComponent } from '../shared/sidemenu/sidemenu.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, SidemenuComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export default class ModulosComponent {

  router = inject(Router);
  pais = inject(PaisService);

  paises: Pais[] = [];

  ngOnInit() {
    this.pais.get().subscribe({
      next: (resp: Pais[]) => {
        this.paises = resp;
        console.log(this.paises);
        this.router.navigate(['modulos']);
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
