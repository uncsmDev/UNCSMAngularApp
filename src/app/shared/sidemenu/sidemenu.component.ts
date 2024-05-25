import { Component, inject } from '@angular/core';
import { routes } from '../../app.routes';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { SubmoduloService } from '../../Services/submodulo.service';


@Component({
  selector: 'app-sidemenu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.css'
})
export class SidemenuComponent {

  auth = inject(AuthService);
  router = inject(Router);

  SudModuloService = inject(SubmoduloService)

  public menuItems = routes.map(
    route => route.children ?? [] 
  )
  .flat()
  .filter(route => route && route.path)
  .filter(route => !route.path?.includes(':'))

  constructor(){
  }

  signOut(){
    sessionStorage.removeItem("loggedInUser");
    this.auth.signOut();
  }

  ngOnInit() {
    this.menuActual()
  }

  menuActual()
  {
    const id = localStorage.getItem("moduloActual");
  
    if (id!== null && id!== undefined) {

      this.SudModuloService.getSubModulo(parseInt(id)).subscribe(
        {
          next: (resp) => 
            {
              console.log(resp);
            },
            error: (err) => {
  
            }
        }
      )
    }

    //this.menuItems = datos;
  }
}
