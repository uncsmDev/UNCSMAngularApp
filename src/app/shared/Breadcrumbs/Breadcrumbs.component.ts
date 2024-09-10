import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { BreadcrumbService } from '@services/shared/Breadcrumb.service';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [
    CommonModule, RouterLink
  ],
  template: `<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
  @for (ins of breadcrumbs(); track ins;) {
    <li class="breadcrumb-item">
      <a [routerLink]="ins.url">{{ ins.label }}</a>
    </li>
  }
  </ol>
</nav>`
 ,
 styles: [`
    .breadcrumb {
     background: none;
     padding: 0;
     margin: 0;
     color: white;
   }
   .breadcrumb-item + .breadcrumb-item::before {
     content: " > ";
   }
   .breadcrumb-item.active {
     color: #6c757d;
   }
 `],
})
export class BreadcrumbsComponent {

  breadcrumbService= inject(BreadcrumbService);
  breadcrumbs$ = this.breadcrumbService.getBreadcrumbs();
  breadcrumbs = toSignal(this.breadcrumbs$);


 }
