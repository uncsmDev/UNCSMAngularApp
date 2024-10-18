import { Component, computed, inject, Signal, signal, viewChild, WritableSignal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Paginacion } from '@interfaces/packPage';
import { Persona } from '@interfaces/persona';
import { ResultEnum } from '@interfaces/Result.interface';
import { Sexo } from '@interfaces/sexo';
import { SubModulo, SubModuloXUserView } from '@interfaces/submodulo';
import { tipoModal} from '@interfaces/trabajador';
import { TrabajadorDto } from '@interfaces/trabajadorInput';
import { ArchivoService } from '@services/admin/archivo.service';
import { TrabajadorService } from '@services/admin/trabajador.service';
import { SubmoduloService } from '@services/submodulo.service';
import { TitleComponent } from 'app/shared/title/title.component';
import { TrabajadorDatosModalComponent } from '../trabajador-datos-modal/trabajador-datos-modal.component';
import { ModalService } from '@services/modal.service';
import { DatosPersonalesInput } from '@interfaces/Updates/datosPersonalesInput ';
import { FdropzoneComponent } from 'app/shared/input/fdropzone/fdropzone.component';



@Component({
  selector: 'app-trabajador-perfil',
  standalone: true,
  imports: [TitleComponent,TrabajadorDatosModalComponent,FdropzoneComponent],
  templateUrl: './trabajador-perfil.component.html',
  styleUrl: './trabajador-perfil.component.css'
})
export default class TrabajadorPerfilComponent {

  _subModuloService=inject(SubmoduloService);
  trabajadorService=inject(TrabajadorService);
  _archivoService=inject(ArchivoService);
  modalService = inject(ModalService);

  matSnackBar=inject(MatSnackBar);

  trabajadorDto = signal<TrabajadorDto>({} as TrabajadorDto);

  subModulosByUser:WritableSignal<SubModuloXUserView[]>=signal([]);
  subModuloByUserList:Signal<SubModuloXUserView[]>=computed(this.subModulosByUser);

  modalDatos = viewChild.required(TrabajadorDatosModalComponent);
  fileRes = signal<SafeUrl | null>(null);
  trabajadorId!: number;
  imageUrl: SafeUrl | undefined;
  fileDir?: string;
  pagSM!:Paginacion;
  
  PostType:tipoModal = 'add';

  constructor(private route: ActivatedRoute,  private sanitizer: DomSanitizer) { }

  ngOnInit(): void 
  {
    this.route.params.subscribe(params => {
      this.trabajadorId = params['id'];
    }); 

    this.getById();
  }
  
  getById()
  {
    this.trabajadorService.getById(this.trabajadorId).subscribe(
      {
        
        next: (data) => {
          if (data.status == ResultEnum.Success) {
           // this.trabajadorDto = data.data;
            this.trabajadorDto.set(data.data);
            this.fileDir = this.trabajadorDto().persona?.img;

            this.GetListSubModuloByUserId(this.trabajadorDto().usuarioId,0);
            if (this.fileDir != null) {
              this._archivoService.getByAddress(this.fileDir).subscribe({
                next: (fileRes) => {
                  if (fileRes.size > 0) {
                    const objectUrl = URL.createObjectURL(fileRes);
                    this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
                    this.fileRes.set(this.sanitizer.bypassSecurityTrustUrl(objectUrl));
                  }
                },
                error: (er) => {
                  this.matSnackBar.open("No se pudo cargar la Imagen", 'Cerrar', { duration: 5000, horizontalPosition: 'center' });
                }
              });
            }

           
          }

        }
      }
    );  
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

  deleteSubModuloXUsuario(id: number)
  {
    this._subModuloService.deleteSubModuloXUsuario(id).subscribe({
      next:(rs)=>{
        this.matSnackBar.open( rs.message,'Cerrar',{ duration:5000, horizontalPosition:'center'});
 
        this.GetListSubModuloByUserId(this.trabajadorDto().usuarioId,this.pagSM.paginaInicio);
      }, 
      error: (error) =>{ console.error("Error", error);
      }
    });
  }

  previousPageModal()
  {
    if(this.pagSM.paginasAnteriores==true)
    {
      this.GetListSubModuloByUserId(this.trabajadorDto().usuarioId,this.pagSM.paginaInicio-1);
    }
  }

 nextPageModal()
  {
    if(this.pagSM.paginasPosteriores==true)
    {
      this.GetListSubModuloByUserId(this.trabajadorDto().usuarioId,this.pagSM.paginaInicio+1);
    }
  }

  datosPersonales: DatosPersonalesInput = {} as DatosPersonalesInput;
  openModalDatos()
  {
    this.datosPersonales.id = this.trabajadorId;
    this.datosPersonales.dni = this.trabajadorDto().persona?.dni;
    this.datosPersonales.nombres = this.trabajadorDto().persona?.nombres;
    this.datosPersonales.apellidos = this.trabajadorDto().persona?.apellidos;
    this.datosPersonales.ins = this.trabajadorDto().trabajador.codigo;
    this.PostType = 'add';
    this.modalDatos().openModal(this.datosPersonales,this.imageUrl);
  }

  closeModal()
  {
    this.modalDatos().closeModal();
  }
}
