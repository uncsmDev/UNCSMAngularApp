import { CommonModule } from '@angular/common';
import { Component, inject, input, signal, OnInit } from '@angular/core';
import { Instrumento } from '@interfaces/instrumento';
import { TipoEntidad } from '@interfaces/tipoEntidad';
import { TipoEntidadService } from '@services/admin/tipoEntidad.service';

@Component({
  selector: 'app-lista-instrumento',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './ListaInstrumento.component.html',
  styleUrl: './ListaInstrumento.component.css',
})
export class ListaInstrumentoComponent { 

  instrumento = input<Instrumento>();
  tipoEntidadService = inject(TipoEntidadService);
  tipoEntidadSignal = signal<TipoEntidad>({nombre: '', id: 0})

  ngOnInit(){
    this.getTipoEntidad();
  }

  getTipoEntidad()
  {
    this.tipoEntidadService.getTipoEntidadByInstrumento(this.instrumento()!).subscribe({
      next: (TipoEntidad) => {
        this.tipoEntidadSignal.set(TipoEntidad.data!);
      }
    })
  }

}
