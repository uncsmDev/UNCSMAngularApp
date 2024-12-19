import { firstValueFrom } from 'rxjs';
import { ChangeDetectionStrategy, Component, inject, signal, type OnInit } from '@angular/core';
import { EvaluacionTrabajadorService } from '@services/sed/EvaluacionTrabajador.service';
import { TokenData } from '@interfaces/acount';
import { jwtDecode } from 'jwt-decode';
import { TitleComponent } from 'app/shared/title/title.component';
import { CardTrabajadorComponent } from '../card-trabajador/card-trabajador.component';
import { Router, RouterLink } from '@angular/router';
import { ResultadosEvaluacionJefe } from '@interfaces/DTOs/PersonaInfoDTO.interface';

@Component({
  selector: 'app-resultados',
  imports: [TitleComponent, CardTrabajadorComponent, RouterLink],
  templateUrl: './resultados.component.html',
  styleUrl: './resultados.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ResultadosComponent implements OnInit {
  evaluacionesSvc = inject(EvaluacionTrabajadorService);
  resultados = signal<ResultadosEvaluacionJefe[]>([]);
  router = inject(Router);
  ngOnInit(): void { 
    this.getResultados();
  }

  async getResultados(){
    const res = JSON.parse(sessionStorage.getItem('loggedInUser')!);
    const decodedToken:TokenData = jwtDecode(res.token);
    const resultados = await firstValueFrom(this.evaluacionesSvc.getResultByUserId(decodedToken.nameid));
    this.resultados.set(resultados.data);
  }

  link(id: number){
    this.router.navigate(["/sed/resultados/resultado-instrumento", id])
  }

}
