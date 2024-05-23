import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TitleComponent } from '../../../shared/title/title.component';

@Component({
  selector: 'app-sed',
  standalone: true,
  imports: [RouterModule, TitleComponent],
  templateUrl: './sed.component.html',
  styleUrl: './sed.component.css'
})
export default class SedComponent {

  router = inject(Router);

  ngOnInit(){
    debugger
    console.log(this.router.url);

    if (this.router.url === '/dashboard/sed') {
      this.router.navigate(['/dashboard/sed/home']);
    }
  }
}
