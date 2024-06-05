import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TitleComponent } from '../../shared/title/title.component';
import { SubmoduloService } from '../../Services/submodulo.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidemenuComponent } from '../../shared/sidemenu/sidemenu.component';
import { initFlowbite } from 'flowbite';
import { SubModulo } from '../../interfaces/submodulo';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterModule, TitleComponent, HeaderComponent, SidemenuComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export default class AdminComponent {
  ngOnInit(){
    initFlowbite();
  }
}
