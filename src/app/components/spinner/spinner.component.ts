import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SpinnerService } from '@services/spinner.service';

@Component({
  selector: 'app-spinner-general',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `
  @if(isLoading())
  {
  <div class="overlay">
    <div class="flex justify-center items-center min-h-screen">
      <div class="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
    </div>
  </div>
  
  }
  `
})
export class SpinnerGeneralComponent { 

  private readonly spinnerSvc = inject(SpinnerService);
  isLoading = this.spinnerSvc.isLoading;

}
