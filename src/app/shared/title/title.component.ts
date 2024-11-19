import { Component, Input, booleanAttribute, signal } from '@angular/core';
import { Location } from '@angular/common';
import { LoginResult } from '@interfaces/acount';

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
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
      <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
      </svg>
      Atrás
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
