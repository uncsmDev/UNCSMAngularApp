import { Component, Input, signal } from '@angular/core';
import { Location } from '@angular/common';

@Component({
    selector: 'app-title',
    imports: [],
    template: `
      <div class="flex justify-between items-center w-full">
        <div>
    <!-- Título a la Izquierda -->
    <h1 class="text-3xl mb-1 text-black dark:text-white font-bold">
      {{title}}</h1>
      <hr class="border bg-gray-500 dark:bg-white decoration-8 decoration-blue-400 dark:decoration-blue-600 pb-1 mb-8 rounded w-16 " />
      </div>
    <!-- Botón a la Derecha -->
    <button (click)="goBack()" 
            type="button" 
            class="text-gray-300 hover:text-gray-100 focus:ring-4 focus:ring-blue-300 font-medium text-lg px-5 pt-1 text-center mr-2 mb-2">
            <i class='bx bx-arrow-back bx-sm'></i>
    </button>
</div>
  `
})
export class TitleComponent {
  @Input({ required: true }) title!: string;
  name = signal('');
  img = signal('');

  constructor(private location: Location){}

  ngOnInit() {
    
  }
  
  goBack(): void {
    this.location.back();
  }
}
