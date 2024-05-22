declare var google: any;

import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginResult } from '../interfaces/acount';
import { HttpClient } from '@angular/common/http';
import { appsettings } from '../Settings/appsettings';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private router = inject(Router);
  private http = inject(HttpClient);

  private apiUrl:string = appsettings.apiUrl + "Account/";
  private tokenKey='token';

  constructor() { }

  signOutGoogle(){
    google.accounts.id.disableAutoSelect();
    this.router.navigate(['login']);
    sessionStorage.clear();
  }

  signOut(){
    google.accounts.id.disableAutoSelect();
    this.router.navigate(['login']);
    sessionStorage.clear();
  }

  login(email: string, password: string)
  {
    debugger
    return this.http.post<LoginResult>(this.apiUrl+ 'login',{
      "username": email,
      "password": password
    })
  }

  googleLogin(idToken: string) {
    return this.http.post<{ token: string }>(
      this.apiUrl + 'google-login',
      {
        idToken: idToken,
      }
    );
  }

  isAuth(){
    if(sessionStorage.getItem("isAuth")!== null && sessionStorage.getItem("isAuth"))
      {
        return true;
      }
    return false;
  }
}
