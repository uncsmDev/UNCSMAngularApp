import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { SubmoduloService } from '../../Services/submodulo.service';
import { SubModulo } from '../../interfaces/submodulo';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-sidemenu',
  standalone: true,
  imports: [RouterModule, RouterLink],
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.css'
})
export class SidemenuComponent {

  auth = inject(AuthService);
  router = inject(Router);
  private sanitizer = inject(DomSanitizer)
  rutaBD:string = '';
  rutaWeb:string = '';

  SudModuloService = inject(SubmoduloService)

  public menuItems:SubModulo[] = []

  constructor(){
  }

  signOut(){
    sessionStorage.removeItem("loggedInUser");
    this.auth.signOut();
  }

  ngOnInit() {
    this.menuActual()
  }

  menuActual() {
    const id = localStorage.getItem("moduloActual");
    if (id !== null && id !== undefined) {
      this.SudModuloService.getSubModulo(parseInt(id)).subscribe({
        next: (resp) => {
          console.log(resp);
          this.menuItems = resp;
        },
        error: (err) => {
          console.error('Error al obtener el submódulo:', err);
        }
      });
    }
  }
  
  getSafeSvg(icon:string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }
}
