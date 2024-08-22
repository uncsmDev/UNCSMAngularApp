import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { TitleComponent } from 'app/shared/title/title.component';

@Component({
  selector: 'app-asignacion-evaluacio',
  standalone: true,
  imports: [
    CommonModule, TitleComponent
  ],
  templateUrl: './asignacion-evaluacio.component.html',
  styleUrl: './asignacion-evaluacio.component.css',
})
export default class AsignacionEvaluacioComponent implements OnInit {

  ngOnInit(): void { }

}
