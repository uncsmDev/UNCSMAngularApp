import { Component, OnInit, Signal, ViewChild, WritableSignal, computed, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Entidad } from '@interfaces/entidad';
import { EntidadService } from '../../../Services/admin/entidad.service';
import { Persona } from '@interfaces/persona';
import { map } from 'rxjs';
import { Sexo } from '@interfaces/sexo';
import { ArchivoService } from '@services/admin/archivo.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UsuarioView } from '@interfaces/usuario';
import { UsuarioService } from '../../../Services/usuario.service';
import { TipoTrabajadorService } from '@services/admin/tipoTrabajador.service';
import { SubmoduloService } from '@services/submodulo.service';
import { PackPage, Paginacion } from '@interfaces/packPage';
import { SubModuloXUserView } from '@interfaces/submodulo';
import { TitleComponent } from 'app/shared/title/title.component';
import {FormsModule,FormBuilder, ReactiveFormsModule, FormGroup, FormControl} from '@angular/forms';
import { ModalInterface } from 'flowbite';
import { Dependencia } from '@interfaces/dependencia';


import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';

import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';

import { Cargo } from '@interfaces/cargo';

import { MatChipsModule} from '@angular/material/chips';

import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { CargoService } from '@services/admin/cargo.service';
import { ModalService } from '@services/modal.service';
import { DependenciaService } from '@services/admin/dependencia.service';
import { SexoService } from '@services/admin/sexo.service';

@Component({
    selector: 'app-perfil.entidad',
    imports: [MatTableModule, MatPaginatorModule, TitleComponent, ReactiveFormsModule, MatAutocompleteModule,
        MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, MatChipsModule, MatIconModule],
    templateUrl: './perfil.entidad.component.html',
    styleUrl: './perfil.entidad.component.css'
})
export default class PerfilEntidadComponent {

  userId!: number;
  entidad!:Entidad;
  persona!:any;
  sexo?:Sexo;
  fileDir?: string;
  UserNet!: UsuarioView;
  //tiposEntidades?: TipoEntidadI[];
  fechaFormat!: string;

  pagSM!:Paginacion;

  fb = inject(FormBuilder);

  subModulosByUser:WritableSignal<SubModuloXUserView[]>=signal([]);
  subModuloByUserList:Signal<SubModuloXUserView[]>=computed(this.subModulosByUser);

  imageUrl: SafeUrl | undefined;

  matSnackBar=inject(MatSnackBar);

  _entidadService=inject(EntidadService);
  _archivoService=inject(ArchivoService);
  _usuarioService=inject(UsuarioService);
  _tipoEntidadService=inject(TipoTrabajadorService);
  _subModuloService=inject(SubmoduloService);

  
entidadFormEdit=this.fb.group({
  id : [''],
  dni: [''],
  codigo: ['000000'],
  nombres: [''],
  apellidos : [''],
  fechaIngreso : [''],
  sexoId: [''],
  cargoId: [''],
  dependenciaId: [''],
   
});

  

  constructor(private route: ActivatedRoute,  private sanitizer: DomSanitizer,private location: Location) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = params['id'];
    });

    this._entidadService.getById(this.userId).subscribe({
      next: (ent) => {
        this.entidad = ent.data; 
        this.persona=ent.data?.persona;
        this.sexo=this.persona.sexoes;
        this.fechaFormat=this.formatearFecha(this.entidad.fechaIngreso);
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

        /*this._tipoEntidadService.getListByIdEntidad(this.entidad.id,'').subscribe({
          next:(te)=>{
            console.log('tipo Entidad::::');
            console.log(te);
            this.tiposEntidades=te.data;
          },
          error:(error)=>{
            console  .error('Error al obtener Usuario:', error);
          }
        });*/
       

        this._usuarioService.getByEntidadId(this.entidad.id).subscribe({
          next: (u)=>
            {
              this.UserNet=u[0];
              this.GetListSubModuloByUserId(this.UserNet.id,0);
            }
        })
        
       
        console.log('on on  Service');
        console.log(this.entidad);
        console.log(this.persona);
        console.log(this.sexo);
        console.log('on end  Service');
      },
      error: (error) => {
        console  .error('Error al obtener la entidad:', error);
      }
    });
   // this.tiposEntidades=ent.data.tipoEntidad;
  }

  GetListSubModuloByUserId(idUser:string,PagSubM:number)
  {
    this._subModuloService.getSubModuloListByUser(idUser,PagSubM).subscribe({
      next:(rsmu)=>{

        this.pagSM=rsmu.paginacion;

        const listSMU=rsmu.listModel.map(item=>({
          id:item.id,
          subModuloId:item.subModuloId,
          ApsNetUserId:item.ApsNetUserId,
          moduloId:item.moduloId,
          subModulo:item.subModulo
        }));

        this.subModulosByUser.set(listSMU);
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

  previousPageModal()
  {
    if(this.pagSM.paginasAnteriores==true)
      {
       this.GetListSubModuloByUserId(this.UserNet.id,this.pagSM.paginaInicio-1);

        //this.GetListIndex(this.pagSM.paginaInicio-1);
      }
 }

 nextPageModal()
  {
    if(this.pagSM.paginasPosteriores==true)
      {
       this.GetListSubModuloByUserId(this.UserNet.id,this.pagSM.paginaInicio+1);
       
      }
 }


 deleteSubModuloXUsuario(SMU:SubModuloXUserView)
 {
   this._subModuloService.deleteSubModuloXUsuario(SMU.id).subscribe({
     next:(rs)=>{
       this.matSnackBar.open( rs.message,'Cerrar',{ duration:5000, horizontalPosition:'center'});

       this.GetListSubModuloByUserId(this.UserNet.id,this.pagSM.paginaInicio);
     }, 
     error: (error) =>{ console.error("Error", error);
     }
   });
 }
  

  formatearFecha(fechaString: Date) {
    const fecha = new Date(fechaString);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son base 0
    const anio = fecha.getFullYear();

    return `${anio}-${mes}-${dia}`;
  }

}
