import { Component, computed, inject, Signal, signal, WritableSignal, input } from '@angular/core';
import {FormBuilder, ReactiveFormsModule, FormControl, Validators} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstadoCivil } from '@interfaces/estado.civil';
import { Pais } from '@interfaces/pais';
import { Sexo } from '@interfaces/sexo';
import { DepartamentoService } from '@services/admin/departamento.service';
import { DependenciaService } from '@services/admin/dependencia.service';
import { EstadoCivilService } from '@services/admin/estado.civil.service';
import { MunicipioService } from '@services/admin/municipio.service';
import { SexoService } from '@services/admin/sexo.service';
import { PaisService } from '@services/pais.service';
import { TitleComponent } from 'app/shared/title/title.component';
import { initFlowbite } from 'flowbite';
import { Dependencia } from '../../../../interfaces/dependencia';
import { CargoService } from '@services/admin/cargo.service';
import { Cargo } from '@interfaces/cargo';


import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TipoContrato } from '@interfaces/tipo_contrato';
import { TipoContratoService } from '@services/admin/tipoContrato.service';

import { FdropzoneComponent } from "../../../../shared/input/fdropzone/fdropzone.component";
import { SubmoduloService } from '@services/submodulo.service';
import { SubModuloViewer, SubModuloViewerTable } from '@interfaces/submodulo';
import { ModuloSelectView } from '@interfaces/modulo';
import { ModuloService } from '@services/modulo.service';
import { ArchivoService } from '@services/admin/archivo.service';
import { TrabajadorInput } from '@interfaces/trabajadorInput';
import { TrabajadorService } from '@services/admin/trabajador.service';
import { ResultEnum } from '@interfaces/Result.interface';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-trabajador-input',
  standalone: true,
  imports: [TitleComponent, ReactiveFormsModule,MatInputModule,
    MatSelectModule,MatFormFieldModule,MatAutocompleteModule,FdropzoneComponent],
  templateUrl: './trabajador-input.component.html',
  styleUrl: './trabajador-input.component.css'
})
export default class TrabajadorInputComponent {

  sexoService=inject(SexoService);
  estadoCivilService=inject(EstadoCivilService);
  paisSevice=inject(PaisService);
  departamentoService=inject(DepartamentoService);
  municipioService=inject(MunicipioService);
  dependenciaService=inject(DependenciaService);
  cargoService=inject(CargoService);
  tipoContratoService=inject(TipoContratoService);
  moduloService=inject(ModuloService);
  archivoService=inject(ArchivoService);
  SubmoduloService=inject(SubmoduloService);
  trabajadorService=inject(TrabajadorService);

  sexos:WritableSignal<Sexo[]>=signal([]);
  sexoList:Signal<Sexo[]>=computed(this.sexos);
  estadoCivils:WritableSignal<EstadoCivil[]>=signal([]);
  estadoCivilList:Signal<EstadoCivil[]>=computed(this.estadoCivils);
  paises:WritableSignal<Pais[]>=signal([]);
  paisList:Signal<Pais[]>=computed(this.paises);
  departementos:WritableSignal<any[]>=signal([]);
  departamentoList:Signal<any[]>=computed(this.departementos);
  municipios:WritableSignal<any[]>=signal([]);
  municipioList:Signal<any[]>=computed(this.municipios);
  dependencias:WritableSignal<Dependencia[]>=signal([]);
  dependenciaList:Signal<Dependencia[]>=computed(this.dependencias);
  tipoContratos:WritableSignal<TipoContrato[]>=signal([]);
  tipoContratoList:Signal<TipoContrato[]>=computed(this.tipoContratos);

  subModulos:WritableSignal<SubModuloViewer[]>=signal([]);
  subModuloList:Signal<SubModuloViewer[]>=computed(this.subModulos);
  subModulosV!: SubModuloViewer[];
  subModulosT:SubModuloViewerTable[]=[];
  searchValue!: string;
  modulos:WritableSignal<ModuloSelectView[]>=signal([]);
  moduloList:Signal<ModuloSelectView[]>=computed(this.modulos);  

  selectedSubModulo!: SubModuloViewer;
  filteredSubModulos!: SubModuloViewer[];

  cargos:WritableSignal<Cargo[]>=signal([]);
  cargoList:Signal<Cargo[]>=computed(this.cargos);
  cargosOrig:WritableSignal<Cargo[]>=signal([]);

  cargoIdControl = new FormControl('');

  img = input.required<SafeUrl | null>();

  displayFnC(subject:any)
  {
    return subject? subject.nombre:undefined;
  }
  
  matSnackBar=inject(MatSnackBar);
  fb = inject(FormBuilder);

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

  GetListEstadoCivil()
  {
    this.estadoCivilService.getList()
    .subscribe({
      next:(rd)=>{
        const listaEst=rd.listModel.map(item=>({
          id:item.id,
          nombre:item.nombre
        }));
    
        this.estadoCivils.set(listaEst);
      }
    });
  }

  GetListPais()
  {
    this.paisSevice.getList()
    .subscribe({
      next:(rd)=>{
        const listaPais=rd.listModel.map(item=>({
          id:item.id,
          nombre:item.nombre
        }));
    
        this.paises.set(listaPais);
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

  GetListCargo(Pagina:number,DependenciaId:number,Filter:string)
  {
    this.cargoService.getListByDependenciaIdWithFilter(Pagina,DependenciaId,Filter)
    .subscribe({
      next:(re)=>{
        const listaCargo=re.listModel.map(item=>({
          id:item.id,
          nombre:item.nombre,
          descripcion:item.descripcion,
          CargoXDependencia:item.cargoXDependencias

        }));
        this.cargos.set(listaCargo);
        this.cargosOrig.set(listaCargo);
      }
    });
  }

  GetListTipoContrato()
  {
    this.tipoContratoService.getList().subscribe({
      next:(tc)=>{
        const listTC=tc.data.map(item=>({
          id:item.id,
          nombre:item.nombre
        }));

        this.tipoContratos.set(listTC);
      }
    })
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

  constructor() { }

  ngOnInit(): void 
  {
    initFlowbite();
    this.GetListSexo();
    this.GetListEstadoCivil();
    this.GetListPais();
    this.GetListDependencia();
    this.GetListTipoContrato();
    this.GetListModulos();
  }

  showPassword: boolean = false;
  showPasswordRe: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  togglePasswordVisibilityRe() {
    this.showPasswordRe = !this.showPasswordRe;
  }

  masterFormInput = this.fb.group
  ({
    id: [0],
    dni: new FormControl(''),
    nombres: new FormControl('', Validators.required),
    apellidos: new FormControl('', Validators.required),
    fechaNace: new FormControl('', Validators.required),
    sexoId: new FormControl('', Validators.required),

    municipioId: new FormControl('', Validators.required),
    estadoCivilId: new FormControl('', Validators.required),
    direccion: new FormControl('', Validators.required),
    telefono1: new FormControl('', Validators.required),
    telefono2: new FormControl(''),
    correoPersonal: new FormControl('',Validators.email),

    codigo: new FormControl('0000', Validators.required),
    fechaIngreso: new FormControl('', Validators.required),

    fechaInicio: new FormControl('', Validators.required),
    fechaFin: new FormControl(''),

    dependenciaId: new FormControl('', Validators.required),
    cargoId: new FormControl('', Validators.required),

   // cargoXdependenciaId: new FormControl('', Validators.required),
    tipoContratoId: new FormControl('', Validators.required),

    email: ['',Validators.email],
    password: [''],
    confirmPassword: [''],
    telefono: new FormControl(''),

  });

  SBMxUForm=this.fb.group({
    subModuloId : 0,
    moduloId: 0,
  });

  onSubmit() 
  {
    if (this.masterFormInput.invalid) {
      this.masterFormInput.markAllAsTouched();
    }
    
    let f:Boolean=true;

     
    if(!this.archivoService.file||this.archivoService.file.length === 0)
      this.matSnackBar.open("Agregue una Imagen/Foto de Perfil mas tarde",'Cerrar',{ duration:5000, horizontalPosition:'center'});
    
    if(this.masterFormInput.valid)
    {
      const input:TrabajadorInput=this.masterFormInput.value as unknown as TrabajadorInput;

      input.SubModulos=this.subModulosT;

      this.trabajadorService.postFull(input,this.archivoService.file).subscribe({
        next:u=>
        {
          if(u.status==ResultEnum.Created ||u.status==ResultEnum.Success)
          {
            this.matSnackBar.open("Dato guardado correctamente",'Cerrar',{ duration:5000, horizontalPosition:'center'});
            this.masterFormInput.reset();
          }
          else
            this.matSnackBar.open("Dato no guardado "+u.message ,'Cerrar',{ duration:5000, horizontalPosition:'center'});
        }
      })

      console.log(input);
      this.matSnackBar.open("Formulario Valido",'Cerrar',{ duration:5000, horizontalPosition:'center'});
    } 
    else
    {
      this.masterFormInput.markAllAsTouched();
      this.matSnackBar.open("Formulario Invalido",'Cerrar',{ duration:5000, horizontalPosition:'center'});

    }
  }

  onSelectedPais(event: Event)
  {
    var valueInput = (event.target as HTMLSelectElement).value;

    this.departamentoService.getListByPaisId(1,parseInt(valueInput)).subscribe({
      next: (data) => {
        this.departementos.set(data.listModel);
      }
    })
  }

  onSelectedDepartamento(event: Event)
  {
    var valueInput = (event.target as HTMLSelectElement).value;

    this.municipioService.getListByDepartamentoId(1,parseInt(valueInput)).subscribe({
      next: (data) => {
        this.municipios.set(data.listModel);
      }
    })
  }

  onSelectedDependencia(event: Event)
  {
    
    this.cargoIdControl.setValue('');
    var valueInput = (event.target as HTMLSelectElement).value;
    this.GetListCargo(1,parseInt(valueInput),'');
  }

  filterCargos(event: any): void 
  {
    const input = (event.target.value as string).toLocaleLowerCase();
    this.cargos.set(this.cargosOrig().filter(ca => ca.nombre.toLowerCase().includes(input)));
  }

  onSelectCargo(event:any)
  {
    this.masterFormInput.controls['cargoId'].setValue(event.option.value.id);
    /*this.SBMxUForm.controls['subModuloId'].setValue(parseInt(event.option.value.id));

    const inputSM=event.option.value;
*/
  }

  displayFn(subject:any)
  {
    return subject? subject.titulo:undefined;
  }
  filterSubModulos(event:any): void 
  {
    this.GetListSubModuloByIdMoulo(parseInt(this.valIdModuloSelect),event.target.value);
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

  valIdModuloSelect!:string;
  idSubModuloSelct=0;

  onSelectedModulo(event: Event)
  {
    this.SBMxUForm.get('subModuloId')?.enable();
    this.valIdModuloSelect = (event.target as HTMLSelectElement).value;

    this.GetListSubModuloByIdMoulo(parseInt(this.valIdModuloSelect),'');
  }
}
