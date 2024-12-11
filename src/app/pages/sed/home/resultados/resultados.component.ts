import { firstValueFrom } from 'rxjs';
import { ChangeDetectionStrategy, Component, inject, signal, type OnInit } from '@angular/core';
import { TrabajadorEvaluacionDTO } from '@interfaces/DTOs/PersonaInfoDTO.interface';
import { EvaluacionTrabajadorService } from '@services/sed/EvaluacionTrabajador.service';
import { TokenData } from '@interfaces/acount';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-resultados',
  imports: [],
  templateUrl: './resultados.component.html',
  styleUrl: './resultados.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ResultadosComponent implements OnInit {
  evaluacionesSvc = inject(EvaluacionTrabajadorService);
  resultados = signal<TrabajadorEvaluacionDTO[]>([]);
  ngOnInit(): void { 
    this.getResultados();
  }

  async getResultados(){
    const res = JSON.parse(sessionStorage.getItem('loggedInUser')!);
    const decodedToken:TokenData = jwtDecode(res.token);
    
    const resultados = await firstValueFrom(this.evaluacionesSvc.getResultByUserId(decodedToken.nameid));

    console.log(resultados);

    this.resultados.set(resultados.data);
  }

}
