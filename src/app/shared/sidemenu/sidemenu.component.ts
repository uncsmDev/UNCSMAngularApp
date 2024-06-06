import { Component, inject } from '@angular/core';
import { routes } from '../../app.routes';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { SubmoduloService } from '../../Services/submodulo.service';
import { SubModulo } from '../../interfaces/submodulo';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


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
  private sanitizer = inject(DomSanitizer)

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

  menuActual()
  {
    const id = localStorage.getItem("moduloActual");
    if (id!== null && id!== undefined) {

      this.SudModuloService.getSubModulo(parseInt(id)).subscribe(
        {
          next: (resp) => 
            {
              this.menuItems = resp;
              console.log(this.router.url);
              const valor = this.menuItems.find(p =>p.path === this.router.url);

              if(valor == undefined || valor == null)
                {
                  this.router.navigate(['/mod']);
                }
            },
            error: (err) => {
  
            }
        }
      );
      
    }

    
  }
  getSafeSvg(icon:string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }
}
