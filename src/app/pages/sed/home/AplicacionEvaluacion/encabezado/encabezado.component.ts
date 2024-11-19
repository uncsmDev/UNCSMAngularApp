import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
    selector: 'app-encabezado',
    imports: [
        CommonModule,
    ],
    template: `<div class="flex flex-col space-y-1">
  <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
  {{titulo()}}  
  </span>
  <span class="text-lg font-semibold text-gray-900 dark:text-white">
    {{valor()}}
  </span>
</div>`,
    styles: `
    :host {
      display: block;
    }
  `
})
export class EncabezadoComponent { 
  titulo = input.required<string>();
  valor = input<string | Date | undefined | null>();
}
