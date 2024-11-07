import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { PersonaInfoDTO } from '@interfaces/DTOs/PersonaInfoDTO.interface';
import { ArchivoService } from '@services/admin/archivo.service';

@Component({
  selector: 'app-card-trabajador',
  standalone: true,
  imports: [
    CommonModule, RouterLink
  ],
  template: `
<div class="container">
  <div class="card-container">
    <a [routerLink]="trabajador().evaluacionTrabajador.evaluacionCuantitativaTerminada == true && trabajador().evaluacionTrabajador.evaluacionCualitativaTerminada == true ? null : ['/sed/evaluacion', trabajador().evaluacionTrabajador.id]">
      <div class="rounded-lg"> 
      
        <div class="w-[280px] h-[380px] relative dark:bg-gray-800 bg-gray-200">
        @if(trabajador().evaluacionTrabajador.evaluacionCuantitativaTerminada == true && trabajador().evaluacionTrabajador.evaluacionCualitativaTerminada == true) {
          <svg class="w-6 h-6 text-gray-800 dark:text-white absolute top-0 right-0 m-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M8 10V7a4 4 0 1 1 8 0v3h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1Zm2-3a2 2 0 1 1 4 0v3h-4V7Zm2 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z" clip-rule="evenodd"/>
              </svg>
          }
        
          <img src="/assets/img/card-perfil.png" alt="gameCard" class="w-full h-full object-cover object-bottom [object-position:right_bottom]">
          <div class="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-2/4 rounded-full border-blue-700 w-[135px] h-[135px] bg-blue-800">
          
        </div>
          @if (trabajador().imgFile?.fileBase64 != null) {
            <img class="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-2/4 rounded-full border-blue-700 w-32 h-32 object-cover" [src]="'data:image/jpeg;base64,'+trabajador().imgFile?.fileBase64"  alt="">
          }
          @else {
            <img class="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-2/4 rounded-full border-blue-700 w-32 h-32 object-cover" src="/assets/img/avatar.svg" alt="user photo">
          }
          <div class="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col w-full">
            <p class="text-xl font-bold dark:text-white text-center text-gray-800">
              {{trabajador().persona.nombres}} {{trabajador().persona.apellidos}}
            </p>
            <p class="text-sm font-medium dark:text-white text-center text-gray-800">
              {{trabajador().cargo.nombre}}
            </p>

            <span class="text-sm text-gray-500 dark:text-gray-400 text-center pt-2">
            <span class="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">{{trabajador().contrato.fechaInicio | date}} </span>  <span class="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">{{trabajador().contrato.fechaFin | date}}</span></span>
            
            
          </div>
          <picture class="absolute bottom-0 left-1 transform -translate-x-2/2 m-6">
                  <!-- Imagen para modo oscuro -->
                  <source srcset="assets/img/logo-white.png" media="(prefers-color-scheme: dark)">
                  <!-- Imagen para modo claro -->
                  <img src="assets/img/logo-color.png" class="h-auto w-auto max-w-full max-h-full" alt="FlowBite Logo">
                </picture>
        </div>
      </div>
    </a>
  </div>
</div>`,
  styleUrl: './card-trabajador.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardTrabajadorComponent {

  trabajador = input.required<PersonaInfoDTO>();
  archivoSvc = inject(ArchivoService);
  sanitizer = inject(DomSanitizer);

 }
