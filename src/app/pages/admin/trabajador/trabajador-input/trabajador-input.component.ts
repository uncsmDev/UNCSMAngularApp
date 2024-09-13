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



@Component({
  selector: 'app-trabajador-input',
  standalone: true,
  imports: [TitleComponent, ReactiveFormsModule],
  templateUrl: './trabajador-input.component.html',
  styleUrl: './trabajador-input.component.css'
})
export default class TrabajadorInputComponent {

  sexoService=inject(SexoService);
  estadoCivilService=inject(EstadoCivilService);
  paisSevice=inject(PaisService);
  departamentoService=inject(DepartamentoService);
  municipioService=inject(MunicipioService);

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

  constructor() { }

  ngOnInit(): void 
  {
    initFlowbite();
    this.GetListSexo();
    this.GetListEstadoCivil();
    this.GetListPais();
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

}
