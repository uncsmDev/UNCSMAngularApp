import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TitleComponent } from '../../shared/title/title.component';
import { SubmoduloService } from '../../Services/submodulo.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidemenuComponent } from '../../shared/sidemenu/sidemenu.component';
import { initFlowbite } from 'flowbite';
import { SubModulo } from '../../interfaces/submodulo';
import { SpinnerGeneralComponent } from 'app/components/spinner/spinner.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterModule, TitleComponent, HeaderComponent, SidemenuComponent, SpinnerGeneralComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export default class AdminComponent {
  ngOnInit(){
    initFlowbite();
  }
}
