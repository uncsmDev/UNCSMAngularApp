import { DatePipe, JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { CardTrabajadorComponent } from './card-trabajador/card-trabajador.component';

@Component({
    selector: 'app-home',
    imports: [RouterLink, DatePipe, JsonPipe, CardTrabajadorComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export default class HomeComponent {
  
}
