import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-usuario',
    imports: [],
    templateUrl: './usuario.component.html',
    styleUrl: './usuario.component.css'
})
export default class UsuarioComponent {

  constructor(private route: ActivatedRoute,  private sanitizer: DomSanitizer){}

  trabajadorId!: number;
  
  ngOnInit(): void 
  {
    this.route.params.subscribe(params => {
      this.trabajadorId = params['id'];
    }); 

    this.getById();
  }

  getById()
  {}

}
