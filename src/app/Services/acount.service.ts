import { inject, Injectable } from '@angular/core';
import { LoginModel, LoginResult } from '../Models/Acount';
import { HttpClient } from '@angular/common/http';
import { appsettings } from '../Settings/appsettings';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AcountService {
  private http = inject(HttpClient);
  private apiUrl:string = appsettings.apiUrl + "Account/";
  private tokenKey='token';

  constructor() { }


  loginService(objeto:LoginModel):Observable<LoginResult>
  {
    console.log("----------------objeto------------------------");
    console.log(objeto);
    console.log(this.apiUrl+"login");
    return this.http.post<LoginResult>(this.apiUrl+"login",objeto).pipe(
      map((res=>
        {
          
          console.log(res);
          if(res.isSuccess)
              localStorage.setItem(this.tokenKey,res.token);
            
            return res;
        })
      )
    );
   
    /*this.http.post<LoginResult>(this.apiUrl+"login",objeto).subscribe({
      next:(data)=>{
        if(data.isSuccess)
        {
          localStorage.setItem(this.tokenKey,data.token);
        }
        return data;
          
      }
    });*/
  }
}
