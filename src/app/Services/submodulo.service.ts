import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { appsettings } from '../Settings/appsettings';
import { SubModulo, SubModuloXUser, SubModuloXUserView } from '../interfaces/submodulo';
import { LoginResult } from '../interfaces/acount';
import { PackPage } from '@interfaces/packPage';
import { Observable } from 'rxjs';
import { Result } from '@interfaces/Result.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SubmoduloService {

  private http = inject(HttpClient);
  private apiUrl:string = appsettings.apiApp + "SubModulo";
  constructor() { }

  getSubModulo(id:number)
  {
    const url = `${this.apiUrl}`;
    const tokenString = sessionStorage.getItem("loggedInUser");
    const token: LoginResult = tokenString ? JSON.parse(tokenString) : null;
    return this.http.get<SubModulo[]>(url + `/GetListUser?id=${id}&userID=${token.token}`);
  }

  getSubModuloFiltrar(id:number)
  {
    const url = `${this.apiUrl}`;
    const tokenString = sessionStorage.getItem("loggedInUser");
    const token: LoginResult = tokenString ? JSON.parse(tokenString) : null;
    
    return this.http.get<SubModulo[]>(url + `/GetListUserFilter?id=${id}&userID=${token.token}`);
  }

  getListByModulo(id:number,filtro:string) //id: id Modulo.// Obtiene lista de submodulo que contienen un id de modulo
  {
    return this.http.get<SubModulo[]>(this.apiUrl+'/GetListByModulo?id='+id+'&filter='+filtro);
  }

  getList(iPag:number): Observable<PackPage<SubModulo>> {
    return this.http.get<PackPage<SubModulo>>(this.apiUrl+'/GetList?pagina='+iPag);
  }

  post(subModulo:SubModulo): Observable<SubModulo> {
    const headers = { 'content-type': 'application/json'} 
    const body=JSON.stringify(subModulo);
    return this.http.post<SubModulo>(this.apiUrl+'/Insert', body,{'headers':headers})
  }

  put(subModulo:SubModulo): Observable<any> {
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(subModulo);
    return this.http.put(this.apiUrl+'/Update/'+subModulo.id, body,{'headers':headers})
  }

  eliminar(sbm?:SubModulo|null): Observable<any> {
    return this.http.delete(this.apiUrl+'/Delete/'+sbm?.id)
  }

  getSubModuloListByUser(idUser:string,pag:number):Observable<PackPage<SubModuloXUserView>>
  {
    const url = `${this.apiUrl}`;
    return this.http.get<PackPage<SubModuloXUserView>>(this.apiUrl+'/GetListByUserView?id='+idUser+'&pagina='+pag);
   // return this.http.get<PackPage<SubModulo>>(url + `/GetListByUserView?id=${idUser}`);
  }

  insertSubModuloXUsuario(smxu:SubModuloXUser):Observable<Result<SubModuloXUser>>
  {
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(smxu);
    return this.http.post<Result<SubModuloXUser>>(this.apiUrl+'/InsertXUser',body,{'headers':headers})
  }

  deleteSubModuloXUsuario(id:number):Observable<Result<boolean>>
  {    
    return this.http.delete<Result<boolean>>(this.apiUrl+'/DeleteByIdSBMU/'+id);
  }
  rutaBD:string = '';
  rutaWeb:string = '';
  public menuItems:SubModulo[] = []
  router = inject(Router);

  menuActual(url: string) {
    const id = localStorage.getItem("moduloActual");
    if (id !== null && id !== undefined) {
      this.getSubModuloFiltrar(parseInt(id)).subscribe({
        next: (resp) => {
          this.menuItems = resp;
          // Encuentra la ruta correspondiente al menú actual
          const valor = this.menuItems.some(p => {
            // Si la ruta exacta coincide, devolverla
            if (p.path === url) {
              return p.path;
            }
  
            // Separar la ruta almacenada en la BD y la URL actual en partes
            const idParts = p.path.split('/');
            const urlParts = url.split('/');
  
            // Si la ruta de la BD tiene un parámetro
            if (idParts.includes('?')) {
              this.rutaBD = '';
              
              // Manejo de varios parámetros opcionales o requeridos
              for (let i = 0; i < idParts.length; i++) {
                // Si el parámetro es '?', reemplázalo por el valor de la URL correspondiente
                if (idParts[i] === '?') {
                  if (i < urlParts.length) {
                    idParts[i] = urlParts[i];
                  } else {
                    return undefined; // No hay valor suficiente en la URL para reemplazar el parámetro
                  }
                }
                // Arma la ruta reconstruida
                this.rutaBD += idParts[i] + (i < idParts.length - 1 ? '/' : '');
              }
            }
            // Verifica si la ruta generada coincide con la URL actual
            const verificaCondicion = (this.rutaBD === url);
            return verificaCondicion ? this.rutaBD : undefined;
          });

          // Si no encuentra la ruta, redirige
          if (valor === undefined || valor === null) {
            this.router.navigate(['/mod']);
          }
        },
        error: (err) => {
          console.error('Error al obtener el submódulo:', err);
        }
      });
    }
  }
}
