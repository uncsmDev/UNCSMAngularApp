import { Component, inject } from '@angular/core';
import { routes } from '../../app.routes';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../Services/auth.service';


@Component({
  selector: 'app-sidemenu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.css'
})
export class SidemenuComponent {

  auth = inject(AuthService);

  public menuItems = routes.map(
    route => route.children ?? [] 
  )
  .flat()
  .filter(route => route && route.path)
  .filter(route => !route.path?.includes(':'))

  constructor(){
    // const dashboardRoutes = routes.map(
    //   route => route.children ?? [] 
    // )
    // .flat()
    // .filter(route => route && route.path)
    // .filter(route => !route.path?.includes(':'))

    // console.log(dashboardRoutes);
  }

  signOut(){
    sessionStorage.removeItem("loggedInUser");
    this.auth.signOut();
  }
}
