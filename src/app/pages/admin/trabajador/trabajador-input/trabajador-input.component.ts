import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
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



@Component({
  selector: 'app-trabajador-input',
  standalone: true,
  imports: [TitleComponent, ReactiveFormsModule,MatInputModule,MatSelectModule,MatFormFieldModule,MatAutocompleteModule],
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
  cargoService=inject(CargoService)

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

  cargos:WritableSignal<Cargo[]>=signal([]);
  cargoList:Signal<Cargo[]>=computed(this.cargos);
  cargosOrig:WritableSignal<Cargo[]>=signal([]);


  cargoIdControl = new FormControl('');

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

  constructor() { }

  ngOnInit(): void 
  {
    initFlowbite();
    this.GetListSexo();
    this.GetListEstadoCivil();
    this.GetListPais();
    this.GetListDependencia();
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
    correoPersonal: new FormControl(''),

    codigo: new FormControl('0000', Validators.required),
    fechaIngreso: new FormControl('', Validators.required),

    fechaInicio: new FormControl('', Validators.required),
    fechaFin: new FormControl(''),

    dependenciaId: new FormControl('', Validators.required),
    cargoId: new FormControl('', Validators.required),

    cargoXdependenciaId: new FormControl('', Validators.required),
    tipoContratoId: new FormControl('', Validators.required),

    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    telefono: new FormControl('', Validators.required),

  });

  onSubmit() 
  {
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
}
