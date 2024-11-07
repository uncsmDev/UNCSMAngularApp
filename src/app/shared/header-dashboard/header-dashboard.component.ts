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


//    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon') as HTMLElement;
//    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
//    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
//     themeToggleLightIcon!.classList.remove('hidden');
// } else {
//     themeToggleDarkIcon.classList.remove('hidden');
// }
  }
  signOut(){
    sessionStorage.removeItem("loggedInUser");
    this.auth.signOut();
  }

  color(){

    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon') as HTMLElement;
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
    // toggle icons inside button
    themeToggleDarkIcon.classList.toggle('hidden');
    themeToggleLightIcon!.classList.toggle('hidden');

    // if set via local storage previously
    if (localStorage.getItem('color-theme')) {
        if (localStorage.getItem('color-theme') === 'light') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        }

    // if NOT set via local storage previously
    } else {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        }
    }
  }
}
