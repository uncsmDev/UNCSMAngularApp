import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Entidad } from '@interfaces/entidad';
import { EntidadService } from '../../../Services/admin/entidad.service';
import { Persona } from '@interfaces/persona';
import { map } from 'rxjs';
import { Sexo } from '@interfaces/sexo';

@Component({
  selector: 'app-perfil.entidad',
  standalone: true,
  imports: [],
  templateUrl: './perfil.entidad.component.html',
  styleUrl: './perfil.entidad.component.css'
})
export default class PerfilEntidadComponent implements OnInit {

  userId!: number;
  entidad?:Entidad;
  persona?:any;
  sexo?:Sexo;

  _entidadService=inject(EntidadService);


  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = params['id'];
    });

    console.log(this.userId);


    
    this._entidadService.getById(this.userId).subscribe({
      next: (ent) => {
        //const enti=ent.data;
       // const per=ent.data?.persona;

        this.entidad = ent.data; 
        this.persona=ent.data?.persona;
        this.sexo=this.persona.sexoes;
        console.log('on on  Service');
        console.log(this.entidad);
        console.log(this.persona);
        console.log(this.sexo);
        console.log('on end  Service');
      },
      error: (error) => {
        console  .error('Error al obtener la entidad:', error);
        // Manejo de errores según tu necesidad
      }
    });
  }


  callFormato()
  {
    if(this.persona?.dni.length==14)
      return this.FormatoDNI(this.persona?.dni);

    else return this.persona?.dni;
  }

  FormatoDNI(cadenaOriginal: string): string {
    const parte1 = cadenaOriginal.substring(0, 3);
    const parte2 = cadenaOriginal.substring(3, 9);
    const parte3 = cadenaOriginal.substring(9, 13);
    const parte4 = cadenaOriginal.substring(13);
    return `${parte1}-${parte2}-${parte3}${parte4}`;
  }

}
