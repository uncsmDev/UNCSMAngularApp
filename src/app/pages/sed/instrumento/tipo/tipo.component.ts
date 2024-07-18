import { Component, inject, signal } from '@angular/core';
import { TipoEvaluacion } from '@interfaces/tipo_evaluacion';
import { InstrumentoService } from '@services/sed/instrumento.service';
import { TitleComponent } from "../../../../shared/title/title.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tipo',
  standalone: true,
  imports: [TitleComponent, RouterLink],
  templateUrl: './tipo.component.html',
  styleUrl: './tipo.component.css'
})
export default class TipoComponent {
  instrumentoService = inject(InstrumentoService)
  tipoEvaluacionSignal = signal<TipoEvaluacion[]>([])

  ngOnInit() {
    this.instrumentoService.getTipoEvaluacion().subscribe(
      {
        next: (data) => {
          this.tipoEvaluacionSignal.set(data);
        }
      }
    )
  }
}
