import { firstValueFrom } from 'rxjs';
import { ChangeDetectionStrategy, Component, inject, signal, type OnInit } from '@angular/core';
import { EvaluacionTrabajadorService } from '@services/sed/EvaluacionTrabajador.service';
import { TokenData } from '@interfaces/acount';
import { jwtDecode } from 'jwt-decode';
import { TitleComponent } from 'app/shared/title/title.component';
import { CardTrabajadorComponent } from '../card-trabajador/card-trabajador.component';
import { RouterLink } from '@angular/router';
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
  ngOnInit(): void { 
    this.getResultados();
  }

  async getResultados(){
    const res = JSON.parse(sessionStorage.getItem('loggedInUser')!);
    const decodedToken:TokenData = jwtDecode(res.token);
    
    console.log(decodedToken.nameid);
    const resultados = await firstValueFrom(this.evaluacionesSvc.getResultByUserId(decodedToken.nameid));



    console.log(resultados);

    this.resultados.set(resultados.data);
  }

}
