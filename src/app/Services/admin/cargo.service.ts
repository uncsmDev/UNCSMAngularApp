import { Result } from '@interfaces/Result.interface';
import { Injectable, inject } from '@angular/core';
import { appsettings } from '../../Settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Cargo, CargoPagination, CargoPaginationDTO, CargosDependenciaGet} from '../../interfaces/cargo';
import { DependenciaList } from '@interfaces/dependencia';
import { PackPage } from '@interfaces/packPage';

@Injectable({
  providedIn: 'root'
})
export class CargoService {
  private http = inject(HttpClient);

  private apiUrl:string = appsettings.apiApp + "Cargo";

  constructor() { }

  getList(): Observable<Cargo[]> {
    var list= this.http.get<Cargo[]>(this.apiUrl+'/GetList');
    return list;
  }
  getWithCargos(id: number, dependenciaId: number){
    return this.http.get<Result<CargosDependenciaGet[]>>(`${this.apiUrl}/GetWithCargos/${id}/${dependenciaId}`);
  }

  getWithoutEvaluacionCargo(Dependencia: DependenciaList) {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(Dependencia);
    var list= this.http.post<Result<Cargo[]>>(`${this.apiUrl}/GetWithoutEvaluacionCargo`, body, {headers});
    return list;
  }

  getCargo(id: number){
    var list= this.http.get<Result<Cargo>>(`${this.apiUrl}/GetCargo/${id}`);
    return list;
  }


  getListByDependenciaIdWithFilter(pagina: number,dependeciaId: number , filterText: string): Observable<PackPage<Cargo>> {

    if(filterText !=='')
      var list= this.http.get<PackPage<Cargo>>(`${this.apiUrl}/GetListByDependenciaIWhithFilter?Pagina=${pagina}&DependenciaId=${dependeciaId}&Filter=${filterText}`);
    else
      var list= this.http.get<PackPage<Cargo>>(`${this.apiUrl}/GetListByDependenciaIWhithFilter?Pagina=${pagina}&DependenciaId=${dependeciaId}`);
      
    
    return list;
  }

  countCargoTrabajadores(CargoId: number, DependenciaId : number) {
    var list= this.http.get<Result<number>>(`${this.apiUrl}/CountCargoTrabajadores/${CargoId}/${DependenciaId}`);
    return list;
  }
}
