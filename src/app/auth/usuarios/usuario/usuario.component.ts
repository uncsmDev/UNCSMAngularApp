import { Component, computed, inject, Signal, signal, WritableSignal, Input, ViewChild, viewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ResultEnum } from '@interfaces/Result.interface';
import { TrabajadorUserDetalle } from '@interfaces/ViewsInterfaces/TrabajadorDetalle';
import { ArchivoService } from '@services/admin/archivo.service';
import { TrabajadorService } from '@services/admin/trabajador.service';
import { SweetalertService } from '@services/sweetalert.service';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { TitleComponent } from 'app/shared/title/title.component';
import { Modulo, ModuloSelectView } from '@interfaces/modulo';
import { SubModulo, SubModuloViewer, SubModuloXUser, SubModuloXUserView } from '@interfaces/submodulo';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { ModuloService } from '@services/modulo.service';
import { SubmoduloService } from '@services/submodulo.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { Paginacion } from '@interfaces/packPage';
import { UsuarioResetPassModalComponent } from '../usuario-reset-pass-modal/usuario-reset-pass-modal.component';
import {UsuarioResetEmailModalComponent} from '../usuario-reset-email-modal/usuario-reset-email-modal.component';
import { UsuarioEliminarModalComponent } from '../usuario-eliminar-modal/usuario-eliminar-modal.component';
import { UsuariosCrearComponent } from "../usuarios-crear/usuarios-crear.component";




@Component({
    selector: 'app-usuario',
    imports: [TitleComponent, MatAutocompleteModule, MatInputModule, UsuarioResetPassModalComponent, UsuarioResetEmailModalComponent, UsuarioEliminarModalComponent, UsuariosCrearComponent],
    templateUrl: './usuario.component.html',
    styleUrl: './usuario.component.css'
})
export default class UsuarioComponent {

  trabajadorService=inject(TrabajadorService);
  archivoService=inject(ArchivoService);
  sweetalert = inject(SweetalertService);
  moduloService=inject(ModuloService);
  SubmoduloService=inject(SubmoduloService);

  subModulosByUser:WritableSignal<SubModuloXUserView[]>=signal([]);
  subModuloByUserList:Signal<SubModuloXUserView[]>=computed(this.subModulosByUser);

  trabajadorUser:WritableSignal<TrabajadorUserDetalle>=signal({} as TrabajadorUserDetalle);
  trabajUser:Signal<TrabajadorUserDetalle>=computed(this.trabajadorUser);
  
  modulos:WritableSignal<ModuloSelectView[]>=signal([]);
  moduloList:Signal<ModuloSelectView[]>=computed(this.modulos);

  subModulos:WritableSignal<SubModuloViewer[]>=signal([]);
  subModuloList:Signal<SubModuloViewer[]>=computed(this.subModulos);
  subModulosV!: SubModuloViewer[];
  searchValue!: string;
  
  selectedSubModulo!: SubModuloViewer;
  filteredSubModulos!: SubModuloViewer[];

  ModuloInSubMod:WritableSignal<Modulo[]>=signal([]);
 ModulosInSubMod:Signal<Modulo[]>=computed(this.ModuloInSubMod);

  constructor(private route: ActivatedRoute,  private sanitizer: DomSanitizer){}

  trabajadorId!: number;
  imageUrl: SafeUrl | undefined;

  valIdModuloSelect!:string;
  idSubModuloSelct=0;
  

  control = new FormControl('');
  fb = inject(FormBuilder);

  Eliminado:boolean=false;

  pagSM!:Paginacion;

  @ViewChild('inputRef') inputElement: any;

  modalPass = viewChild.required(UsuarioResetPassModalComponent);
  modalEmail = viewChild.required(UsuarioResetEmailModalComponent);
  modalDel = viewChild.required(UsuarioEliminarModalComponent);
  modalCreate=viewChild.required(UsuariosCrearComponent);

  ngOnInit(): void 
  {
    this.route.params.subscribe(params => {
      this.trabajadorId = params['id'];
    }); 
  
    this.GetListModulos();
    this.getById();
  }

  InputForm=this.fb.group({
    subModuloId : 0,
    ApsNetUserId: [''],
    moduloId: 0,
    nombres:[''],
    apellidos:[''],
  });


  async getById()
  {
    const rp= await firstValueFrom(this.trabajadorService.getDetalleUser(this.trabajadorId));

    if (rp.status == ResultEnum.Success) 
    {
      this.trabajadorUser.set(rp.data);
      if (this.trabajadorUser().img != null) 
      {
        const file = await firstValueFrom(this.archivoService.getByAddress(this.trabajadorUser().img!));
      

        if (file.size > 0)
        {
          const objectUrl = URL.createObjectURL(file);
          this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
        }
          
      }
      else
      {
        Swal.fire({
          title: 'Advertencia!',
          html: '<p>No se encontro una imagen.</p>',
          icon: 'warning',
          confirmButtonText: 'Ok',
          ...this.sweetalert.theme,
        })
      }

      if(rp.data.userId != null)
      {
        this.GetListSubModuloByUserId(rp.data.userId,1);
      }

    }
    else{
      Swal.fire({
        title: 'Advertencia!',
        html: '<p>'+rp.message+'.</p>',
        icon: 'warning',
        confirmButtonText: 'Ok',
        ...this.sweetalert.theme,
      })
    }
  }
  async CrearRestaurarUsuario()
  {
   
     const user= await firstValueFrom(this.trabajadorService.buscarRestaurarUsuario(this.trabajadorId))

     if(user.status==ResultEnum.Success)
     {
      Swal.fire({
        title: 'Información!',
        html: '<p>Este perfil de trabajador contaba con una cuenta de usuario se ha procedido a activarla. \n Los privilegios se an eliminado </p>',
        icon: 'success',
        confirmButtonText: 'Ok',
        ...this.sweetalert.theme,
      });
      this.actualizarPagina(true);
     }

     else if(user.status==ResultEnum.NotFound)
     {
      this.openModalCrearUser();
     }
     
  }

  async GetListModulos()
  {

    const rm= await firstValueFrom(this.moduloService.getList());

    if(rm!=null)
    {
      this.modulos.set(rm);
    }
  }

  
  displayFn(subject:any)
  {
    return subject? subject.titulo:undefined;
  }


  onSelectedModulo(event: Event)
  {
    this.InputForm.get('subModuloId')?.enable();
    this.valIdModuloSelect = (event.target as HTMLSelectElement).value;

    this.GetListSubModuloByIdMoulo(parseInt(this.valIdModuloSelect),'');
  }

  GetListSubModuloByIdMoulo(id:number,filter:string)//id Modulo
  {
   if(filter==null)
     filter='';

   this.SubmoduloService.getListByModulo(id,filter).subscribe({
     next:(rsm)=>{
       const listSM=rsm.map(item=>({ id:item.id,titulo:item.titulo}));
       this.subModulos.set(listSM);
       this.filteredSubModulos = this.subModulosV;
       this.subModulosV =rsm;
     this.filteredSubModulos = this.subModulosV;
     }
   });
  }

  filterSubModulos(event:any): void 
  {
    this.GetListSubModuloByIdMoulo(parseInt(this.valIdModuloSelect),event.target.value);
  }

  async GetListSubModuloByUserId(idUser:string,PagSubM:number)
  {
    const rsmu= await firstValueFrom(this.SubmoduloService.getSubModuloListByUser(idUser,PagSubM));

    if(rsmu!=null)
    {
      const listSMU=rsmu.listModel.map(item=>({
        id:item.id,
        subModuloId:item.subModuloId,
        ApsNetUserId:item.ApsNetUserId,
        moduloId:item.moduloId,
        subModulo:item.subModulo
      }));
      this.subModulosByUser.set(listSMU);

      this.pagSM=rsmu.paginacion;

      var grupos : Modulo[] = [];
      listSMU.forEach(item => {
        const modulo = item.subModulo.modulo;
  
        if (grupos.length == 0 ) 
        {
          grupos.push(modulo);
        }
        else 
        {
          if(!grupos.find(g => g.id == modulo.id))
            grupos.push(modulo);
        }
      });
      this.ModuloInSubMod.set(Object.values(grupos));


      //this.agruparSubModulos();
    }

  }
  
  agruparSubModulos() 
  {
    var grupos : Modulo[] = []; 
    // Acceder a la señal y agrupar los submódulos
    this.subModulosByUser().forEach(item => {
    const modulo = item.subModulo.modulo;
  
      if (grupos.length == 0 ) 
      {
        grupos.push(modulo);
      }
      else 
      {
        if(!grupos.find(g => g.id == modulo.id))
          grupos.push(modulo);
      }
    });
  
    // Actualizar la señal con el resultado agrupado
    this.ModuloInSubMod.set(Object.values(grupos));
  }



  GetListSubModuloByUserIdFilterIdModulo(idUser:string,PagSubM:number,idModuloF:number)
  {
    this.SubmoduloService.getSubModuloListByUser(idUser,PagSubM).subscribe({
      next:(rsmu)=>{

        this.pagSM=rsmu.paginacion;

        const listSMU=rsmu.listModel.map(item=>({
          id:item.id,
          subModuloId:item.subModuloId,
          ApsNetUserId:item.ApsNetUserId,
          moduloId:item.moduloId,
          subModulo:item.subModulo
        }));
        this.subModulosByUser.set(listSMU.filter(lsmu=>lsmu.moduloId==idModuloF));
      }
    });
  }
  
  onSelectSubModulo(event:any)
  {
    this.InputForm.controls['subModuloId'].setValue(parseInt(event.option.value.id));
    this.InputForm.controls['ApsNetUserId'].setValue( this.trabajadorUser().userId);
  
    const subModuloUserInsert: SubModuloXUser=this.InputForm.value as SubModuloXUser;
    this.SubmoduloService.insertSubModuloXUsuario(subModuloUserInsert).subscribe({
      next:(res)=>{
     
        if(res.status=ResultEnum.Created)
          {
            this.inputElement.nativeElement.value = '';
            console.log("Guardado exitoso");
            this.GetListSubModuloByUserId(this.trabajadorUser().userId,this.pagSM.paginaInicio);
          
          }
        else {
          this.GetListSubModuloByUserId(this.trabajadorUser().userId,this.pagSM.paginaInicio);
          console.log("Error ");
          this.inputElement.nativeElement.value = '';
        } 
      },
      error: (error) => 
        { 
          if(error.error.errors.ConfirmPassword!=null)
            console.log("Error", error);
        }
    });

  }


  deleteSubModuloXUsuario(SMU:SubModuloXUserView)
  {
    this.SubmoduloService.deleteSubModuloXUsuario(SMU.id).subscribe({
      next:(rs)=>{
        console.log(rs);

        this.GetListSubModuloByUserId(this.trabajadorUser().userId,this.pagSM.paginaInicio);
      }, 
      error: (error) =>{ console.error("Error", error);
      }
    });
  }

   //-------------- Paginacion Inicio ---------------------------
   previousPage()
   {
     if(this.pagSM.paginasAnteriores==true)
       {
        this.GetListSubModuloByUserId(this.trabajadorUser().userId,this.pagSM.paginaInicio-1);
       }
  }

  nextPage()
   {
    console.log(this.pagSM);
     if(this.pagSM.paginasPosteriores==true)
       {
        this.GetListSubModuloByUserId(this.trabajadorUser().userId,this.pagSM.paginaInicio+1);
    
       }
  }
   //---------------Paginacion fin --------------------------------

   

   
  openModalResetPass()
  {
    this.modalPass().openModal(this.trabajadorUser().correo!);
  }

  openModalChangeEmail()
  {
    this.modalEmail().openModal(this.trabajadorUser().correo!);
  }


  openModalDelete()
  {
    this.modalDel().openModal(this.trabajadorUser().correo!);
  }

  openModalCrearUser()
  {
    this.modalCreate().openModal(this.trabajadorUser().id,this.trabajUser().nombres+' '+this.trabajUser().apellidos);
  }

  actualizarCorreo(input:string)
  {
    this.trabajadorUser().correo=input;
  }

  actualizarEliminado(input:boolean)
  {
    this.Eliminado=input;
    location.reload();
  }

  actualizarPagina(input:boolean)
  {
    this.Eliminado=input;
    location.reload();
  }
}
