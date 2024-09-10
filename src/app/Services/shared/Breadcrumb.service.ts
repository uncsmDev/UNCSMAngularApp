import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, distinctUntilChanged, filter } from 'rxjs';

interface BreadCrumb {
  label: string;
  url: string;
}


@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private breadcrumbs = new BehaviorSubject<BreadCrumb[]>([]);

  constructor(private router: Router, private route: ActivatedRoute) {
    // Escuchar eventos de navegación y construir breadcrumbs cuando cambie la ruta
    
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),  // Solo NavigationEnd para capturar la navegación completa
        distinctUntilChanged()  // Ignorar duplicados
      )
      .subscribe(() => {
        
        const breadcrumbs = this.buildBreadcrumbs(this.route, this.router);
        this.breadcrumbs.next(breadcrumbs);
      });
  }

   private buildBreadcrumbs(route: ActivatedRoute, router: Router, url: string = '', breadcrumbs: BreadCrumb[] = []): BreadCrumb[] {
    
    //console.log(router.lastSuccessfulNavigation);
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');

      if (routeURL !== '') {
        url += `/${routeURL}`;
        console.log(routeURL);
        
      }

      // Verificar si la ruta tiene datos de breadcrumb
      const label = child.snapshot.data['breadcrumb'];
      if (label) {
        breadcrumbs.push({ label, url });
      }

      console.log(breadcrumbs);

      return this.buildBreadcrumbs(child, router, url, breadcrumbs);
    }

    return breadcrumbs;
  }

  // Método para obtener el observable de breadcrumbs
  getBreadcrumbs() {
    return this.breadcrumbs.asObservable();
  }

}
