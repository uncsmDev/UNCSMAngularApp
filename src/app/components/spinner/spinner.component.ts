import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SpinnerService } from '@services/spinner.service';

@Component({
    selector: 'app-spinner-general',
    imports: [
        CommonModule,
    ],
    template: `
  @if(isLoading())
  {
  <div class="overlay">
    <div class="absolute inset-0 bg-black bg-opacity-100 flex justify-center items-center min-h-screen z-50" style="z-index: 999;">
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
