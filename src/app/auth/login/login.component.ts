import { AuthService } from './../../Services/auth.service';
declare var google: any;
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginModel } from '../../models/Login.Model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent implements OnInit{
  
  matSnackBar=inject(MatSnackBar);
  private router = inject(Router);
  authServices=inject(AuthService);

  logMin:LoginModel;

  constructor()
  {
    this.logMin=new LoginModel();
  }

  ngOnInit(): void {

    google.accounts.id.initialize({
      client_id: '696911734143-glg1l9idu915jdaggc6mmd2v15vc5slg.apps.googleusercontent.com',
      callback: (resp: any) => this.onLoginGoogle(resp)
    });

    google.accounts.id.renderButton(document.getElementById("google-btn"), {
      theme: 'filled_blue',
      size: 'large',
      shape: 'rectangle',
      width: 350
    })
  }

  onLogin(){
    const email = this.logMin.username;
    const password = this.logMin.password;

    this.authServices.login(email, password).subscribe( {
      
      next:(resp)=>{
        
        sessionStorage.setItem("loggedInUser", JSON.stringify(resp));
        sessionStorage.setItem("isAuth", "true");
        this.router.navigate(['mod']);
      },
      error:(error)=>{
        this.matSnackBar.open("Credenciales Incorectas",'Close',{ duration:5000, horizontalPosition:'center'})
      }
    });
  }
 
  private decodeToken(token: string)
  {
    return JSON.parse(atob(token.split(".")[1]));
  }

  onLoginGoogle(response: any){
    if(response){
    this.authServices.googleLogin(response.credential).subscribe({
      next: (resp) => {
      if(resp)
        {
          sessionStorage.setItem("loggedInUser", JSON.stringify(resp));
          sessionStorage.setItem("isAuth", "true");
          this.router.navigate(['mod']);
        }
        else{
          this.matSnackBar.open("Credenciales Incorectas",'Close',{ duration:5000, horizontalPosition:'center'})
        }
    },
    error: (err) => {
      this.matSnackBar.open("Error en la aplicación ",'Close',{ duration:5000, horizontalPosition:'center'});
    
    }});
  }
  }
}