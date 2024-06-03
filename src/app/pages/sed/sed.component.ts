import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TitleComponent } from '../../shared/title/title.component';
import { SubmoduloService } from '../../Services/submodulo.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidemenuComponent } from '../../shared/sidemenu/sidemenu.component';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-sed',
  standalone: true,
  imports: [RouterModule, TitleComponent, HeaderComponent, SidemenuComponent],
  templateUrl: './sed.component.html',
  styleUrl: './sed.component.css'
})
export default class SedComponent {

  router = inject(Router);

  ngOnInit(){
    initFlowbite();
    if (this.router.url === '/sed') {
      this.router.navigate(['/sed/home']);
    }
  }
}
