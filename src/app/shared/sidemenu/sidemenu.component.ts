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

  menuActual()
  {
    const id = localStorage.getItem("moduloActual");
    if (id!== null && id!== undefined) {
      this.SudModuloService.getSubModulo(parseInt(id)).subscribe(
        {
          next: (resp) => 
            {
              this.menuItems = resp;
              const valor = this.menuItems.find(p => {
                if(p.path === this.router.url){
                  return p.path;
                }
                const id = p.path.split('/');
                                 
                if(id[id.length-1] === '?')
                {
                  const id_ruta = this.router.url.split('/');
                  id[id.length-1] = id_ruta[id_ruta.length-1];
                  this.rutaBD = '';
                  for (let i = 0; i < id.length; i++) {
                    this.rutaBD += id[i] + (i < id.length-1 ? '/' : '');
                  }
                }
                                 
                return this.rutaBD == this.router.url ? p : undefined
              });

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
