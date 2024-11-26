import { CommonModule } from '@angular/common';
import { Component, ElementRef, input, signal, viewChild, type OnInit } from '@angular/core';

@Component({
  selector: 'app-alert-dialog',
  imports: [CommonModule],
  template: `<div #toast class="toast" [ngClass]="{'active': isToastActive()}">
  
  <div class="toast-content">
    <i class='bx bx-error-circle check'></i>

    <div class="message">
      <span class="text text-1">{{tittle()}}</span>
      <span class="text text-2">{{message()}}</span>
    </div>
  </div>
  <i (click)="close()" class='bx bx-x close'></i>

  <!-- Remove 'active' class, this is just to show in Codepen thumbnail -->
  <div #progress class="progress" [ngClass]="{'active': isProgressActive()}"></div>
</div>`,
  styleUrl: './alertDialog.component.css',
})
export class AlertDialogComponent implements OnInit {

  tittle = input.required<string>();
  message = input.required<string>();

  toast = viewChild<ElementRef<HTMLDivElement>>('toast');
  progress = viewChild<ElementRef<HTMLDivElement>>('progress');

  isToastActive = signal(true); // Controla si el toast tiene la clase activa
  isProgressActive = signal(true); // Controla si el toast tiene la clase activa
  ngOnInit(): void { 
    this.toastEvent();
  }
  toastEvent()
  {
    this.isToastActive.set(true);
    this.isProgressActive.set(true); 

    this.toast()?.nativeElement.classList.add("active");
    this.progress()?.nativeElement.classList.add("active");

     setTimeout(() => {
      this.isToastActive.set(false);
      this.isProgressActive.set(false);
    }, 5000); // 5 segundos
  }


  close()
  {
    this.isToastActive.set(false);
    this.isProgressActive.set(false);
  }
}
