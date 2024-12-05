import { DatePipe, JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { CardTrabajadorComponent } from './card-trabajador/card-trabajador.component';
import { EvaluacionTrabajadorService } from '@services/sed/EvaluacionTrabajador.service';
import { TokenData } from '@interfaces/acount';
import { jwtDecode } from 'jwt-decode';

@Component({
    selector: 'app-home',
    imports: [RouterLink, DatePipe, JsonPipe, CardTrabajadorComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export default class HomeComponent {
    evaluacionTrabajador = inject(EvaluacionTrabajadorService);
  countPersonal = signal(false);

  ngOnInit(): void {
    const res = JSON.parse(sessionStorage.getItem('loggedInUser')!);
    const decodedToken:TokenData = jwtDecode(res.token);
    
    this.evaluacionTrabajador.getCountPersonal(decodedToken.nameid).subscribe(res => {
      this.countPersonal.set(res.data);
    });
  }
}
