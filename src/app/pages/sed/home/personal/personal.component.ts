import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, type OnInit } from '@angular/core';
import { TitleComponent } from 'app/shared/title/title.component';
import { CardTrabajadorComponent } from '../card-trabajador/card-trabajador.component';
import { EvaluacionTrabajadorService } from '@services/sed/EvaluacionTrabajador.service';
import { ArchivoService } from '@services/admin/archivo.service';
import { DomSanitizer } from '@angular/platform-browser';
import { TokenData } from '@interfaces/acount';
import { AuthService } from '@services/auth.service';
import { PersonaInfoDTO } from '@interfaces/DTOs/PersonaInfoDTO.interface';

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [
    CommonModule, TitleComponent, CardTrabajadorComponent
  ],
  templateUrl: './personal.component.html',
  styleUrl: './personal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PersonalComponent implements OnInit {
  evaluacionTrabajadorSvc = inject(EvaluacionTrabajadorService);
  DataToken = signal<TokenData>({} as TokenData);
  auth = inject(AuthService);

  Perfil = signal<PersonaInfoDTO>({} as PersonaInfoDTO);
  Trabajadores = signal<PersonaInfoDTO[]>([]);

  ngOnInit(): void {
    this.DataToken.set(this.auth.getDataUser()); 
    this.evaluacionTrabajadorSvc.getById(this.DataToken().personaId).subscribe(
      {
        next: (res) => {
          if(res.data != null)
          {
            this.Perfil.set(res.data);
            this.GetPersonalByIdDependencia(this.Perfil())
            
          }
          
        }
      }
    );
  }
  
  GetPersonalByIdDependencia(Perfil: PersonaInfoDTO){
    this.evaluacionTrabajadorSvc.GetPersonalByIdDependencia(Perfil.dependencia.id, Perfil.persona.id).subscribe(
    {
        next: (res) => {
          debugger;
          this.Trabajadores.set(res.data);
        }
      }
    );
  }

}
