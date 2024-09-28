import { Component } from '@angular/core';


import { TitleComponent } from 'app/shared/title/title.component';

@Component({
  selector: 'app-trabajador-perfil',
  standalone: true,
  imports: [TitleComponent],
  templateUrl: './trabajador-perfil.component.html',
  styleUrl: './trabajador-perfil.component.css'
})
export default class TrabajadorPerfilComponent {

}
