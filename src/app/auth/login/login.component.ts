declare var google: any;
import { AcountService } from '../../Services/acount.service';
import { LoginResult, LoginModel } from '../../Models/Acount';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LowerCasePipe } from '@angular/common';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent implements OnInit{
  
  acountServices=inject(AcountService);
  formU!:FormGroup;
  fg=inject(FormBuilder);
  loginMod!:LoginModel;
  logMin:loginMin;

  matSnackBar=inject(MatSnackBar);
  private router = inject(Router);

  constructor()
  {
    this.logMin=new loginMin();
  }

  login()
  {

 
    console.log("--------------------------------");
    console.log(this.logMin);
    /*this.loginMod.password=this.logMin.password;
    this.loginMod.username=this.logMin.username;*/

    /*this.acountServices.loginService(this.logMin).subscribe((resp)=>
      {
        console.log(resp);
      });*/


      this.acountServices.loginService(this.logMin).subscribe(
      {
        next:(resp)=>{
          this.matSnackBar.open(resp.email,'Close',{ duration:5000, horizontalPosition:'center'})
          //this.router.navigate(['/'])
        },
        error:(error)=>{
          this.matSnackBar.open("Credenciales Incorectas",'Close',{ duration:5000, horizontalPosition:'center'})
        }
      });
  }

  ngOnInit(): void {

    google.accounts.id.initialize({
      client_id: '696911734143-glg1l9idu915jdaggc6mmd2v15vc5slg.apps.googleusercontent.com',
      callback: (resp: any) => this.handleLogin(resp)
    });

    google.accounts.id.renderButton(document.getElementById("google-btn"), {
      theme: 'filled_blue',
      size: 'large',
      shape: 'rectangle',
      width: 350
    })
    

    this.formU!=this.fg.group({
      username:['',[Validators.required,Validators.email]],
      password:['',[Validators.required]]
    })
  }

  private decodeToken(token: string)
  {
    return JSON.parse(atob(token.split(".")[1]));
  }

  handleLogin(response: any){
    if(response){
      //Decode the token
      const payLoad = this.decodeToken(response.credential);
      //store in session
      sessionStorage.setItem("loggedInUser", JSON.stringify(payLoad));
      //navigate to Dashboard
      this.router.navigate(['modulos']);
    }
  }

}


export class loginMin
{
  username:string;
  password:string;
  constructor (){
    this.username="";
    this.password="";
  }
}