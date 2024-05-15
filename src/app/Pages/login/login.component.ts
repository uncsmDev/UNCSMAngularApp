import { Component, Inject, inject, OnInit } from '@angular/core';
import { LoginModel, LoginResult } from '../../Models/Acount';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AcountService } from '../../Services/acount.service';
import { LowerCasePipe } from '@angular/common';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
 
  acountServices=inject(AcountService);
  formU!:FormGroup;
  fg=inject(FormBuilder);
  loginMod!:LoginModel;
  logMin:loginMin;

  matSnackBar=inject(MatSnackBar);
  router=Inject(Router);

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
    this.formU!=this.fg.group({
      username:['',[Validators.required,Validators.email]],
      password:['',[Validators.required]]
    })
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