import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TitleComponent } from '../../shared/title/title.component';
import { SubmoduloService } from '../../Services/submodulo.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidemenuComponent } from '../../shared/sidemenu/sidemenu.component';
import { initFlowbite } from 'flowbite';
import { SubModulo } from '../../interfaces/submodulo';
import { SpinnerGeneralComponent } from 'app/components/spinner/spinner.component';
import { LoginResult, TokenData } from '@interfaces/acount';

@Component({
  selector: 'app-sed',
  standalone: true,
  imports: [RouterModule, TitleComponent, HeaderComponent, SidemenuComponent, SpinnerGeneralComponent],
  templateUrl: './sed.component.html',
  styleUrl: './sed.component.css'
})
export default class SedComponent {
  ngOnInit(){
    initFlowbite();
  }  
}
