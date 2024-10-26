import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { TokenData } from '@interfaces/acount';

@Component({
  selector: 'app-header-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './header-dashboard.component.html',
  styleUrl: './header-dashboard.component.css'
})
export class HeaderDashboardComponent {
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
