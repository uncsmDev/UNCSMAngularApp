import { Component, ElementRef, inject, viewChild, viewChildren } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { SubmoduloService } from '../../Services/submodulo.service';
import { SubModulo } from '../../interfaces/submodulo';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import 'boxicons'
@Component({
    selector: 'app-sidemenu',
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

  aside = viewChild<ElementRef<HTMLElement>>('logoSidebar');
  titulos = viewChildren<ElementRef<HTMLElement>>('titulos');
  titulo = viewChild<ElementRef<HTMLElement>>('titulo');
  button = viewChild<ElementRef<HTMLElement>>('button');

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

    const contenedor = document.querySelector('.containerBody');
// Alternar clases manualmente
if (window.innerWidth >= 640) { // Tailwind's sm breakpoint
  contenedor?.classList.remove('ml-16');
    contenedor?.classList.add('ml-64');
} else {
    
  contenedor?.classList.remove('ml-64');
  contenedor?.classList.remove('ml-16');
}
  }

  menuActual() {
    const id = localStorage.getItem("moduloActual");
    if (id !== null && id !== undefined) {
      this.SudModuloService.getSubModulo(parseInt(id)).subscribe({
        next: (resp) => {
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

  toggleMenu(event : Event) {
    event.preventDefault();
    const toggle = event.target as HTMLInputElement;
    console.log(toggle.checked);
    
    const menu = document.querySelector('.menu');
    const contenedor = document.querySelector('.containerBody');

    if (toggle.checked!) {
      menu?.classList.remove('menu-open');
      menu?.classList.add('menu-closed');

      contenedor?.classList.remove('ml-64');
      contenedor?.classList.add('ml-16');
    } else {
      menu?.classList.remove('menu-closed');
      menu?.classList.add('menu-open');

      contenedor?.classList.add('ml-64');
      contenedor?.classList.remove('ml-16');
    }
  }
}
