import { Component, Signal, WritableSignal, computed, inject, signal, AfterViewInit, ViewChild, AfterContentInit, input } from '@angular/core';
import { initFlowbite,InstanceOptions } from 'flowbite';
import {PackPage, Paginacion} from '../../../../interfaces/packPage'
import {InsertUsuario, UsuarioViewModel} from '../../../../interfaces/usuario'
import { Router } from '@angular/router'; 

import { map, startWith } from 'rxjs/operators';


import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';

import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatIconModule} from '@angular/material/icon';

import {MatPaginatorModule} from '@angular/material/paginator';
import { MatTableModule} from '@angular/material/table';
import {FormsModule,FormBuilder, ReactiveFormsModule, FormGroup, FormControl, Validators} from '@angular/forms';

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
import { FdropzoneComponent } from "../../../../shared/input/fdropzone/fdropzone.component";
import { EntidadFullDto } from '@interfaces/entidad';
import { ArchivoService } from '@services/admin/archivo.service';
import { Archivo } from '../../../../interfaces/archivo';
import { EntidadService } from '@services/admin/entidad.service';



@Component({
  selector: 'app-input-entidad',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, TitleComponent, ReactiveFormsModule, ModalDeleteComponent, MatAutocompleteModule,
    MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, MatChipsModule, MatIconModule, FdropzoneComponent ],
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
  archivoService=inject(ArchivoService);
  entidadService=inject(EntidadService);


  matSnackBar=inject(MatSnackBar);
  fb = inject(FormBuilder);

  modulos:WritableSignal<ModuloSelectView[]>=signal([]);
  moduloList:Signal<ModuloSelectView[]>=computed(this.modulos);

  subModulos:WritableSignal<SubModuloViewer[]>=signal([]);
  subModuloList:Signal<SubModuloViewer[]>=computed(this.subModulos);
  subModulosV!: SubModuloViewer[];
  subModulosT:SubModuloViewerTable[]=[];
  searchValue!: string;

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

  masterForm=this.fb.group({
    id : [0],
    dni: new FormControl(''),
    codigo: new FormControl('0000', Validators.required),
    nombres: new FormControl('', Validators.required),
    apellidos: new FormControl('', Validators.required),
    sexoId: new FormControl('', Validators.required),
    fechaIngreso:new FormControl('', Validators.required),

   // imgPerfilInput: new FormControl('', Validators.required),

    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    telefono: new FormControl('', Validators.required),
    cargoId: new FormControl('', Validators.required),
    dependenciaId: new FormControl('', Validators.required)

  });


  /*
    masterForm=this.fb.group({
    id : [''],
    dni: [''],
    codigo: ['000000',Validators.required],
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    sexoId: ['', Validators.required],
    fechaIngreso: ['', Validators.required],

    imgPerfilInput: ['', Validators.required],

    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    telefono: ['', Validators.required],
    cargoId: [null],
    tipoEntidad: [null],
    dependenciaId: [null],
    subModuloId:[null],
    SubModuloXUserInput: [[], Validators.required],
  });

  */ 

 
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
        {
        this._tiposEntidades.push(item);
      }
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

    const inputSM=event.option.value;
    
    if(!this.subModulosT|| this.subModulosT.length==0)
    {
      this.subModulosT.push(inputSM);
    }
    else 
      if(!this.subModulosT.find(f=>f.id===inputSM.id))
        this.subModulosT.push(inputSM);
  }

    Infile?:Archivo;
  onSubmit()
  {
  
    let f:Boolean=true;
   
    if(this._tiposEntidades.length===0)
    {
      this.matSnackBar.open("Especifique el Tipo de Trabajador",'Cerrar',{ duration:5000, horizontalPosition:'center'});
      f=false;
    }
    else
    {

    }

    if(!this.archivoService.file||this.archivoService.file.length === 0)
      this.matSnackBar.open("Agregue una Imagen/Foto de Perfil mas tarde",'Cerrar',{ duration:5000, horizontalPosition:'center'});

    if (this.masterForm.valid && f) 
    {
      //const moduloIn: ModuloView = this.moduloFormInput.value as unknown as ModuloView;
      const inputMaster: EntidadFullDto = this.masterForm.value as unknown as EntidadFullDto;
   
      //inputMaster.fileA =this.archivoService.file;
      inputMaster.tipoEntidad = this._tiposEntidades;

      inputMaster.SubModulos = this.subModulosT;
      console.log(inputMaster);

      console.log('OnSumit   valid::::: ');

      this.entidadService.postFullMaster(inputMaster,this.archivoService.file).subscribe({
        next: u=>{
          this.matSnackBar.open("Dato guardado correctamente",'Cerrar',{ duration:5000, horizontalPosition:'center'});

        },
        error: (error) => { 

            this.matSnackBar.open(error,'Cerrar',{ duration:5000, horizontalPosition:'center'});
         }
      });

    }
    else
      this.matSnackBar.open("Complete los datos para poder Guardar",'Cerrar',{ duration:5000, horizontalPosition:'center'});


  }

  deleteSubModuloXUsuario(SMU:SubModuloViewerTable)
  {
    
    this.subModulosT=this.subModulosT.filter( k=>k.id!==SMU.id);

    this.matSnackBar.open('Objeto Eliminado','Cerrar',{ duration:5000, horizontalPosition:'center'});

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
