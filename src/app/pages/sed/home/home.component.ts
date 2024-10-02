import { DatePipe, JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { TokenData } from '@interfaces/acount';
import { PersonaInfoDTO } from '@interfaces/DTOs/PersonaInfoDTO.interface';
import { ArchivoService } from '@services/admin/archivo.service';
import { DependenciaService } from '@services/admin/dependencia.service';
import { AuthService } from '@services/auth.service';
import { EvaluacionTrabajadorService } from '@services/sed/EvaluacionTrabajador.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, DatePipe, JsonPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export default class HomeComponent {
  evaluacionTrabajadorSvc = inject(EvaluacionTrabajadorService);
  archivoSvc = inject(ArchivoService);
  sanitizer = inject(DomSanitizer);
  DataToken = signal<TokenData>({} as TokenData);
  auth = inject(AuthService);

  Perfil = signal<PersonaInfoDTO[]>([]);
  Trabajadores = signal<PersonaInfoDTO[]>([]);

  ngOnInit(): void {
    this.DataToken.set(this.auth.getDataUser()); 
    this.evaluacionTrabajadorSvc.getById(this.DataToken().personaId).subscribe(
      {
        next: (res) => {
          this.Perfil.set(res.data);
          if(this.Perfil().length == 1){
            this.GetPersonalByIdDependencia(this.Perfil())
          }
        }
      }
    );
  }
  
  GetPersonalByIdDependencia(Perfil: PersonaInfoDTO[]){
    this.evaluacionTrabajadorSvc.GetPersonalByIdDependencia(Perfil[0].dependencia.id, Perfil[0].persona.id).subscribe(
      {
        next: (res) => {
          this.Trabajadores.set(res.data);
          console.log(this.Trabajadores());
          this.getImg();
        }
      }
    );
  }

  activar(){
    
  }

  getImg() {
    this.Trabajadores.update(trabajadores => {
      return trabajadores.map(trabajador => {
        if(trabajador.persona.img == null) return trabajador;
        this.archivoSvc.getByAddress(trabajador.persona.img).subscribe({
          next: (res: Blob) => {
            // Crear una URL segura para la imagen Blob
            const objectURL = URL.createObjectURL(res);
            // Actualizar la imagen en el trabajador
            trabajador.img = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          },
          error: (err) => {
            console.error('Error al obtener la imagen:', err);
          }
        });
        return trabajador;
      });
    });
  }
}
