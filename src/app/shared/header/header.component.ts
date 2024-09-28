import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { RouterLink } from '@angular/router';
import { TokenData } from '@interfaces/acount';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  auth = inject(AuthService);

  DataToken = signal<TokenData>({} as TokenData);
  ngOnInit(){
   this.DataToken.set(this.auth.getDataUser()); 
  }

  signOut(){
    sessionStorage.removeItem("loggedInUser");
    this.auth.signOut();
  }


}
