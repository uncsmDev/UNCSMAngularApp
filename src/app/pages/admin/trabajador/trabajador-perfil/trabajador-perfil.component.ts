import { Component, computed, inject, Signal, signal, viewChild, WritableSignal, output } from '@angular/core';
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
import { TrabajadorInfoPersonalModalComponent } from '../trabajador-info-personal-modal/trabajador-info-personal-modal.component';
import { ModalService } from '@services/modal.service';
import { DatosPersonalesInput, InformacionPersonal } from '@interfaces/Updates/datosPersonalesInput ';
import { FdropzoneComponent } from 'app/shared/input/fdropzone/fdropzone.component';
import TrabajadorComponent from "../trabajador.component";
import { SweetalertService } from '@services/sweetalert.service';
import Swal from 'sweetalert2';



@Component({
    selector: 'app-trabajador-perfil',
    imports: [TitleComponent, TrabajadorDatosModalComponent, TrabajadorInfoPersonalModalComponent, FdropzoneComponent, TrabajadorComponent],
    templateUrl: './trabajador-perfil.component.html',
    styleUrl: './trabajador-perfil.component.css'
})
export default class TrabajadorPerfilComponent {

  _subModuloService=inject(SubmoduloService);
  trabajadorService=inject(TrabajadorService);
  _archivoService=inject(ArchivoService);
  modalService = inject(ModalService);
  sweetalert = inject(SweetalertService);

  matSnackBar=inject(MatSnackBar);

  trabajadorDto = signal<TrabajadorDto>({} as TrabajadorDto);

  subModulosByUser:WritableSignal<SubModuloXUserView[]>=signal([]);
  subModuloByUserList:Signal<SubModuloXUserView[]>=computed(this.subModulosByUser);

  modalDatos = viewChild.required(TrabajadorDatosModalComponent);
  modalInfoPersonal = viewChild.required(TrabajadorInfoPersonalModalComponent);
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

  actualizarimagen(datosGuardados: DatosPersonalesInput){

    if (datosGuardados.img!= '') 
      this.imageUrl = datosGuardados.img!;
    
    this.trabajadorDto().persona.nombres = datosGuardados.nombres!;
    this.trabajadorDto().persona.apellidos = datosGuardados.apellidos!;
    this.trabajadorDto().persona.dni = datosGuardados.dni!;
    this.trabajadorDto().trabajador.codigo = datosGuardados.ins!;
  
  }
  
  actualizarInfo(output:InformacionPersonal)
{
  try
  {
    
    this.trabajadorDto.update(v=>({...v,persona:{...v.persona,sexoId:output.sexoId!}}));
    this.trabajadorDto.update(v=>
      ({
        ...v, 
        datosGenerales: ({
          ...v.datosGenerales,
          //id: output.id,
          estadoCivilId: output.estadoCivilId,
          sexoId: output.sexoId,
          municipioId: output.municipioId,
          direccion: output.direccion,
          telefono1: output.telefono1,
          telefono2: output.telefono2,
          correoPersonal: output.correoPersonal
          })
      })
  );
    
  }
  catch(error)
  {
    console.log("error::::");
    console.log(error);
  } 

}

  getById()
  {
    this.trabajadorService.getById(this.trabajadorId).subscribe(
      {
        
        next: (data) => {
          if (data.status == ResultEnum.Success) {
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
                  

                  Swal.fire({
                    title: 'Advertencia!',
                    html: '<p>'+er+'.</p>',
                    icon: 'warning',
                    confirmButtonText: 'Ok',
                    ...this.sweetalert.theme,
                  })


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
  infoPersonal: InformacionPersonal = {} as InformacionPersonal;


  openModalDatos()
  {
    this.datosPersonales.id = this.trabajadorId;
    this.datosPersonales.dni = this.trabajadorDto().persona?.dni;
    this.datosPersonales.nombres = this.trabajadorDto().persona?.nombres;
    this.datosPersonales.apellidos = this.trabajadorDto().persona?.apellidos;
    this.datosPersonales.ins = this.trabajadorDto().trabajador.codigo;
    
  
    this.PostType = 'edit';
    this.modalDatos().openModal(this.datosPersonales,this.imageUrl);
  }

  openModalInfo()
  {
    this.infoPersonal.id = this.trabajadorId;
    if(this.trabajadorDto().persona?.sexoId!=null)
      {
        this.infoPersonal.sexoId = this.trabajadorDto().persona?.sexoId;
      }
      if(this.trabajadorDto().datosGenerales!=null)
      {
        this.infoPersonal.estadoCivilId = this.trabajadorDto().datosGenerales.estadoCivilId;
        this.infoPersonal.telefono1 = this.trabajadorDto().datosGenerales.telefono1;
        this.infoPersonal.telefono2 = this.trabajadorDto().datosGenerales.telefono2;
        this.infoPersonal.direccion = this.trabajadorDto().datosGenerales.direccion;
        this.infoPersonal.correoPersonal = this.trabajadorDto().datosGenerales.correoPersonal;
        this.infoPersonal.municipioId = this.trabajadorDto().datosGenerales.municipioId;
        this.infoPersonal.paisId = this.trabajadorDto().paisId;
        this.infoPersonal.departamentoId = this.trabajadorDto().departamentoId;
      }
      else
      {
        this.infoPersonal.paisId = 1;
        this.infoPersonal.departamentoId = 1;
      }
     
    this.PostType = 'edit';
    this.modalInfoPersonal().openModal(this.infoPersonal);
  }


  closeModal()
  {
    
    this.modalDatos().closeModal();
  }

  formatearFecha(fechaString: Date) {
    const fecha = new Date(fechaString);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son base 0
    const anio = fecha.getFullYear();

    return `${anio}-${mes}-${dia}`;
  }
}
