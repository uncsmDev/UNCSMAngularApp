import { Component, Input, booleanAttribute } from '@angular/core';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [],
  template:`
    <h1 class="text-3xl mb-1 dark:text-white font-bold ">
      
      {{title}}</h1>
      <hr class="border bg-gray-500 dark:bg-white decoration-8 decoration-blue-400 dark:decoration-blue-600 pb-1 mb-8 rounded w-16 " />
  `
})
export class TitleComponent {
  @Input({ required: true }) title!: string;
}
