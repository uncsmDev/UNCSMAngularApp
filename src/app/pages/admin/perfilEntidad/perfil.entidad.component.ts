import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Entidad } from '@interfaces/entidad';
import { EntidadService } from '../../../Services/admin/entidad.service';
import { Persona } from '@interfaces/persona';
import { map } from 'rxjs';
import { Sexo } from '@interfaces/sexo';
import { ArchivoService } from '@services/admin/archivo.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TipoEntidad } from '@interfaces/tipoEntidad';
import { UsuarioView } from '@interfaces/usuario';
import { UsuarioService } from '../../../Services/usuario.service';

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
  fileDir?: string;
  UserNet!: UsuarioView;
  tiposEntidades?: TipoEntidad[];

  imageUrl: SafeUrl | undefined;

  matSnackBar=inject(MatSnackBar);

  _entidadService=inject(EntidadService);
  _archivoService=inject(ArchivoService);
  _usuarioService=inject(UsuarioService);
  

  constructor(private route: ActivatedRoute,  private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = params['id'];
    });

    this._entidadService.getById(this.userId).subscribe({
      next: (ent) => {

        this.entidad = ent.data; 
        this.persona=ent.data?.persona;
        this.sexo=this.persona.sexoes;

        this.fileDir=ent.data?.persona?.img;

        if(this.fileDir!=null)
        {
           this._archivoService.getByAddress(this.fileDir).subscribe({
            next:(fileRes)=>
            {
              if(fileRes.size>0)
              {
                  const objectUrl = URL.createObjectURL(fileRes);
                  this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
              }
            },
            error:(er)=>
            {
              this.matSnackBar.open("No se pudo cargar la Imagen",'Cerrar',{ duration:5000, horizontalPosition:'center'});
            }
           });
        }
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

    this._usuarioService.getByEntidadId(this.entidad?.id).subscribe({
      next:(Usuarios)=>{
        const lus=Usuarios.data.map(item=>({
          id:item.id,
          entidadId:item.entidadId,
          email:item.email,
          phoneNumber:item.phoneNumber
        }))
      },
      error:(error)=>{
        console  .error('Error al obtener Usuario:', error);
      }
    })
    
   // this.tiposEntidades=ent.data.tipoEntidad;
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
