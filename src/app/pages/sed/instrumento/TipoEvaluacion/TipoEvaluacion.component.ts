import { CommonModule } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { TipoEvaluacionesService } from '@services/sed/TipoEvaluaciones.service';
import { toSignal } from '@angular/core/rxjs-interop'
import { TitleComponent } from 'app/shared/title/title.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tipo-evaluacion',
  standalone: true,
  imports: [
    CommonModule, TitleComponent, RouterLink
  ],
  templateUrl: './TipoEvaluacion.component.html',
  styleUrl: './TipoEvaluacion.component.css',
})
export default class TipoEvaluacionComponent implements OnInit {

  tiposEvaluacionesSvc = inject(TipoEvaluacionesService)

  tipos$ = toSignal(this.tiposEvaluacionesSvc.get());

  ngOnInit(): void {
    
   }

}
