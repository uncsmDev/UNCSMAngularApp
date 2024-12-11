import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild, type OnInit } from '@angular/core';
import { TitleComponent } from 'app/shared/title/title.component';
import { CardTrabajadorComponent } from '../card-trabajador/card-trabajador.component';
import { EvaluacionTrabajadorService } from '@services/sed/EvaluacionTrabajador.service';
import { TokenData } from '@interfaces/acount';
import { AuthService } from '@services/auth.service';
import {PersonaDTO, PersonalPorDependenciaDTO } from '@interfaces/DTOs/PersonaInfoDTO.interface';
import { AlertDialogComponent } from 'app/components/alertDialog/alertDialog.component';

@Component({
    selector: 'app-personal',
    imports: [
        CommonModule, TitleComponent, CardTrabajadorComponent, AlertDialogComponent
    ],
    templateUrl: './personal.component.html',
    styleUrl: './personal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PersonalComponent implements OnInit {
  evaluacionTrabajadorSvc = inject(EvaluacionTrabajadorService);
  DataToken = signal<TokenData>({} as TokenData);
  auth = inject(AuthService);

  Perfil = signal<PersonaDTO>({} as PersonaDTO);
  Trabajadores = signal<PersonalPorDependenciaDTO[]>([]);
  mensaje = signal(false);

  constructor() { }

  ngOnInit(): void {
    this.DataToken.set(this.auth.getDataUser()); 
    this.evaluacionTrabajadorSvc.getById(this.DataToken().personaId).subscribe(
      {
        next: (res) => {
          if(res.data != null)
          {
            console.log(res);
            this.Perfil.set(res.data);
            this.GetPersonalDependencia(this.Perfil())
          }
          else{
            this.mensaje.set(true);
          }
        }
      }
    );
  }
  GetPersonalDependencia(Perfil: PersonaDTO){
    this.evaluacionTrabajadorSvc.getPersonalDependencia(Perfil.dependenciaId , Perfil.personaId).subscribe(
    {
        next: (res) => {
          console.log(res);
          this.Trabajadores.set(res.data);
        }
      }
    );
  }

  

}
