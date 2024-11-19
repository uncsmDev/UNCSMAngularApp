import { CommonModule } from '@angular/common';
import { Component, inject, input, type OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TipoTrabajadorService } from '@services/admin/tipoTrabajador.service';
import { FlowbitSharedService } from '@services/flowbit-shared.service';
import { TitleComponent } from 'app/shared/title/title.component';

@Component({
    selector: 'app-instrumentos',
    imports: [
        CommonModule, TitleComponent, RouterLink
    ],
    templateUrl: './TipoTrabajador.component.html',
    styleUrl: './TipoTrabajador.component.css'
})
export default class InstrumentosComponent implements OnInit {

  tipoTrabajadorSvc = inject(TipoTrabajadorService);
  flowbitSVG = inject(FlowbitSharedService) 

  tiposTrabajadores$ = this.tipoTrabajadorSvc.get();
  tiposTrabajadores = toSignal(this.tiposTrabajadores$);

  TipoEvaluacionId = input<number>(0, {alias: 'id'});

  ngOnInit(): void { }

  sanar(icon: string)
  {
    this.flowbitSVG.getSafeSvg(icon);
  }

}
