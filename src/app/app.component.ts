import { SpinnerGeneralComponent } from './components/spinner/spinner.component';
import LoginComponent  from './auth/login/login.component';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';

import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { SpinnerComponent } from './shared/spinner/spinner.component';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,MatButtonModule, MatMenuModule,LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'UNCSM App';

  ngOnInit(): void {
    initFlowbite();
  }
}
