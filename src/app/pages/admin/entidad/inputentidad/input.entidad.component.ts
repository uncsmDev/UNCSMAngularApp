import { Component, Signal, WritableSignal, computed, inject, signal,AfterViewInit, ViewChild, AfterContentInit } from '@angular/core';
import { initFlowbite,InstanceOptions } from 'flowbite';
import {PackPage, Paginacion} from '../../../../interfaces/packPage'
import {InsertUsuario, UsuarioViewModel} from '../../../../interfaces/usuario'
import { Router } from '@angular/router'; 

import { map, startWith } from 'rxjs/operators';


import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';

import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatIconModule} from '@angular/material/icon';

import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {FormsModule,FormBuilder, ReactiveFormsModule, FormGroup, FormControl} from '@angular/forms';

import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';


import { Cargo } from '../../../../interfaces/cargo';
import { TitleComponent } from '../../../../shared/title/title.component';


import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalDeleteComponent } from '../../../../components/modal-delete/modal-delete.component';

import { CargoService } from '../../../../Services/admin/cargo.service';
import { TipoEntidadService } from '../../../../Services/admin/tipoEntidad.service';
import { TipoEntidad } from '../../../../interfaces/tipoEntidad';
import { Dependencia } from '../../../../interfaces/dependencia';
import { DependenciaService } from '../../../../Services/admin/dependencia.service';
import { Sexo } from '../../../../interfaces/sexo';
import { SexoService } from '../../../../Services/admin/sexo.service';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ModuloSelectView } from '@interfaces/modulo';
import { ModuloService } from '@services/modulo.service';
import { SubmoduloService } from '@services/submodulo.service';
import { SubModuloViewer, SubModuloViewerTable, SubModuloXUser, SubModuloXUserView } from '@interfaces/submodulo';





@Component({
  selector: 'app-input-entidad',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, TitleComponent, ReactiveFormsModule, ModalDeleteComponent,MatAutocompleteModule,
    MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule,MatChipsModule, MatIconModule],
  templateUrl: './input.entidad.component.html',
  styleUrl: './input.entidad.component.css'
})

export default class InputEntidadComponent  {


  cargoService=inject(CargoService)

  tipoEntidadService=inject(TipoEntidadService);
  dependenciaService=inject(DependenciaService);
  sexoService=inject(SexoService);
  SubmoduloService=inject(SubmoduloService);
  moduloService=inject(ModuloService);


  matSnackBar=inject(MatSnackBar);
  fb = inject(FormBuilder);

  modulos:WritableSignal<ModuloSelectView[]>=signal([]);
  moduloList:Signal<ModuloSelectView[]>=computed(this.modulos);

  subModulos:WritableSignal<SubModuloViewer[]>=signal([]);
  subModuloList:Signal<SubModuloViewer[]>=computed(this.subModulos);
  subModulosV!: SubModuloViewer[];
  searchValue!: string;

  subModulosT:SubModuloViewerTable[]=[];

  subModulosByUser:WritableSignal<SubModuloXUserView[]>=signal([]);
  subModuloByUserList:Signal<SubModuloXUserView[]>=computed(this.subModulosByUser);
  
  selectedSubModulo!: SubModuloViewer;
  filteredSubModulos!: SubModuloViewer[];

  cargos:WritableSignal<Cargo[]>=signal([]);
  cargoList:Signal<Cargo[]>=computed(this.cargos);

  tiposEntidades:WritableSignal<TipoEntidad[]|any>=signal([]);
  tipoEntidadList:Signal<TipoEntidad[]>=computed(this.tiposEntidades);
  _tiposEntidades:TipoEntidad[]=[];

  dependencias:WritableSignal<Dependencia[]>=signal([]);
  dependenciasList:Signal<Dependencia[]>=computed(this.dependencias);

  sexos:WritableSignal<Sexo[]>=signal([]);
  sexoList:Signal<Sexo[]>=computed(this.sexos);

  valIdModuloSelect!:string;
  idSubModuloSelct=0;

  pag!:Paginacion;
  pagSM!:Paginacion;

  countryControl = new FormControl();

  userInModal!:UsuarioViewModel;

  teForm!:FormGroup;
  dropdownSettings: any = {};
  disabled = false;
  ShowFilter = false;
  limitSelection = false;
  selectedItems= [];
  tipoEntidadItems:TipoEntidad []|any;

  @ViewChild(ModalDeleteComponent) modal!: ModalDeleteComponent;

  @ViewChild('inputRef') inputElement: any;
  @ViewChild('inputSub') inputSubM: any;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];


  showPassword: boolean = false;
  showPasswordRe: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  togglePasswordVisibilityRe() {
    this.showPasswordRe = !this.showPasswordRe;
  }

  entidadForm=this.fb.group({
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

  userForm=this.fb.group({
    entidadId : 0,
    email: [''],
    password: [''],
    confirmPassword: [''],
    nombres : [''],
    apellidos : [''],
    telefono : [''],
  });

  SBMxUForm=this.fb.group({
    subModuloId : 0,
    ApsNetUserId: [''],
    moduloId: 0,
    nombres:[''],
    apellidos:[''],
  });


  constructor(private router: Router)
  {
    
  }

  GetListSexo()
  {
    this.sexoService.getList()
    .subscribe({
      next:(rd)=>{
        const listaSex=rd.map(item=>({
          id:item.id,
          nombre:item.nombre
        }));
    
        this.sexos.set(listaSex);
      }
    });
  }

  GetListDependencia()
  {
    this.dependenciaService.getList()
    .subscribe({
      next:(rd)=>{
        const listaDe=rd.map(item=>({
          id:item.id,
          nombre:item.nombre,
          dependenciaId:item.dependenciaId,
          objDependencia:item.objDependencia
        }));
    
        this.dependencias.set(listaDe);
      }
    });
  }

  GetListTipoEntidad()
  {
    this.tipoEntidadService.getList()
    .subscribe({
      next:(re)=>{
        const listaTE=re.map(item=>({
          id:item.id,
          nombre:item.nombre
        }));
       // this.tipoEntidadItems=listaTE;
       debugger;
        this.tiposEntidades.set(listaTE);
      }
    });
  }
  GetListTipoEntidadByFilterName(filter:string)
  {
    this.tipoEntidadService.getListByFilterName(filter)
    .subscribe({
      next:(res)=>{
        if(res.status===0)
        {
          var re=res.data;
          const listaTE =res.data?.map(item=>({
            id:item.id,
            nombre:item.nombre
          }));

          //this.tipoEntidadItems=listaTE;
  
          this.tiposEntidades.set(listaTE);
        }
       
      }
    });
  }

  GetListCargo()
  {
    this.cargoService.getList()
    .subscribe({
      next:(re)=>{
        const listaCargo=re.map(item=>({
          id:item.id,
          nombre:item.nombre,
          descripcion:item.descripcion
        }));
        this.cargos.set(listaCargo);
      }
    });
  }


  displayFn(subject:any)
  {
    return subject? subject.titulo:undefined;
  }
  
  
  GetListModulos()
  {
    this.moduloService.getList().subscribe({
      next:(rm)=>{
        const listmodulo=rm.map(item=>({
          id:item.id,
          titulo:item.titulo
        }));
        this.modulos.set(listmodulo);
      }

    });
  }

  GetListSubModuloByUserId(idUser:string,PagSubM:number)
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
        this.subModulosByUser.set(listSMU);
      }
    });
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

  ngOnInit(): void {
    initFlowbite();
    this.GetListCargo();
    this.GetListDependencia();
    this.GetListSexo();
    this.GetListTipoEntidad();
    this.GetListModulos();

    this.SBMxUForm.get('subModuloId')?.disable();
  }


  formatearFecha(fechaString:Date) {
    const fecha = new Date(fechaString);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son base 0
    const anio = fecha.getFullYear();

    return `${anio}-${mes}-${dia}`;
}


onSelectedModulo(event: Event)
{
  this.SBMxUForm.get('subModuloId')?.enable();
  this.valIdModuloSelect = (event.target as HTMLSelectElement).value;

  this.GetListSubModuloByIdMoulo(parseInt(this.valIdModuloSelect),'');
}

filterSubModulos(event:any): void 
{
  this.GetListSubModuloByIdMoulo(parseInt(this.valIdModuloSelect),event.target.value);
}


  onItemSelect(item: any) {
    console.log('onItemSelect', item);
}

  remove(tipoEnt:TipoEntidad)
  {
    this._tiposEntidades=this._tiposEntidades.filter(r=>r.id!==tipoEnt.id);
  }

  addTEToEntidad(event: any)
  {

  }

  selected(event: MatAutocompleteSelectedEvent): void {

    //this.entidadForm.controls['tipoEntidadId'].setValue(this._tiposEntidades.);
    event.option.deselect();

    var item=event.option.value;

    if(!this._tiposEntidades || this._tiposEntidades.length===0)
     {
      this._tiposEntidades.push(item);
     }
     else
      if(!this._tiposEntidades.find(f=>f.id===item.id))
        this._tiposEntidades.push(item);
      
  }

  filterTipoEntidad(event:any)
  {
    if(event.data===null)
      this.GetListTipoEntidad();

    else
      this.GetListTipoEntidadByFilterName(event.target.value);
  }


  onSelectSubModulo(event:any)
  {
    this.SBMxUForm.controls['subModuloId'].setValue(parseInt(event.option.value.id));

    const subModuloUserInsert: SubModuloXUser=this.SBMxUForm.value as SubModuloXUser;

    console.log('OnSelectSubModulo:::::::');
    console.log(subModuloUserInsert);
    console.log('OnSelectSubModulo::::::: V');
    console.log(event.option.value);

    const inputSM=event.option.value;

    console.log('OnSelectSubModulo:::::::inputSM');
    console.log(inputSM); 

    if(!this.subModulosT|| this.subModulosT.length==0)
    {
      this.subModulosT.push(inputSM);
    }
    else 
      if(!this.subModulosT.find(f=>f.id===inputSM.id))
        this.subModulosT.push(inputSM);


   /* this.SubmoduloService.insertSubModuloXUsuario(subModuloUserInsert).subscribe({
      next:(res)=>{
     
        if(res.status=Repuesta.Created)
          {
            this.inputElement.nativeElement.value = '';
            this.matSnackBar.open('Guardado exitoso: ' + res.message,'Cerrar',{ duration:5000, horizontalPosition:'center'});

            this.GetListSubModuloByUserId(this.userInModal.id,this.pagSM.paginaInicio);
          
          }
        else {
          this.GetListSubModuloByUserId(this.userInModal.id,this.pagSM.paginaInicio);
          this.matSnackBar.open(res.message) ;
          this.inputElement.nativeElement.value = '';
        } 
      },
      error: (error) => { 

        if(error.error.errors.ConfirmPassword!=null)
          this.matSnackBar.open('Algo salio mal','Cerrar',{ duration:5000, horizontalPosition:'center'})}
    });*/

  }


  onSubmit()
  {}

  deleteSubModuloXUsuario(SMU:SubModuloViewerTable)
  {
    
    this.subModulosT=this.subModulosT.filter( k=>k.id!==SMU.id);

    this.matSnackBar.open('Objeto Eliminado','Cerrar',{ duration:5000, horizontalPosition:'center'});

  }

    //-------------- Paginacion Inicio ---------------------------
    previousPageModal()
    {
      if(this.pagSM.paginasAnteriores==true)
        {
         const idUser=this.SBMxUForm.get('ApsNetUserId')?.value?.toString();
         this.GetListSubModuloByUserId(this.userInModal.id,this.pagSM.paginaInicio-1);
 
          //this.GetListIndex(this.pagSM.paginaInicio-1);
        }
   }
 
   nextPageModal()
    {
      if(this.pagSM.paginasPosteriores==true)
        {
         this.GetListSubModuloByUserId(this.userInModal.id,this.pagSM.paginaInicio+1);
         
        }
   }
   

   pageSize: number = 5;
   currentPage: number = 1;
 
    get paginated() {
     const start = (this.currentPage - 1) * this.pageSize;
     const end = start + this.pageSize;
     return this.subModulosT.slice(start, end);
   }
 
   nextPage() {
     if (this.currentPage * this.pageSize < this.subModulosT.length) {
       this.currentPage++;
     }
   }
 
   previousPage() {
     if (this.currentPage > 1) {
       this.currentPage--;
     }
   }
    //---------------Paginacion fin --------------------------------
}
