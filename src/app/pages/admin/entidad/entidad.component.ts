import { Component, Signal, WritableSignal, computed, inject, signal,AfterViewInit, ViewChild, AfterContentInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import {PackPage, Paginacion} from '../../../interfaces/packPage'
import {InsertUsuario} from '../../../interfaces/usuario'
import { Router } from '@angular/router';
import type { InstanceOptions } from 'flowbite';
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

import { Observable } from 'rxjs';
import { Entidad, EntidadDto } from '../../../interfaces/entidad';
import { Cargo } from '../../../interfaces/cargo';
import { EntidadService } from '../../../Services/admin/entidad.service';
import { TitleComponent } from '../../../shared/title/title.component';


import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalDeleteComponent } from '../../../components/modal-delete/modal-delete.component';
import { ModalService } from '../../../Services/modal.service';
import { ModalInterface } from 'flowbite';
import { CargoService } from '../../../Services/admin/cargo.service';
import { TipoEntidadService } from '../../../Services/admin/tipoEntidad.service';
import { TipoEntidad } from '../../../interfaces/tipoEntidad';
import { Dependencia } from '../../../interfaces/dependencia';
import { DependenciaService } from '../../../Services/admin/dependencia.service';
import { Sexo } from '../../../interfaces/sexo';
import { SexoService } from '../../../Services/admin/sexo.service';
import { UsuarioService } from '../../../Services/usuario.service';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';


@Component({
    selector: 'app-entidad',
    standalone: true,
    templateUrl: './entidad.component.html',
    styleUrl: './entidad.component.css',
    imports: [MatTableModule, MatPaginatorModule, TitleComponent, ReactiveFormsModule, ModalDeleteComponent,MatAutocompleteModule,
          MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule,MatChipsModule, MatIconModule]
})
export default class EntidadComponent {

  entidadService=inject(EntidadService);
  cargoService=inject(CargoService)
  modalService = inject(ModalService);
  tipoEntidadService=inject(TipoEntidadService);
  dependenciaService=inject(DependenciaService);
  sexoService=inject(SexoService);
  usuarioService=inject(UsuarioService)

  matSnackBar=inject(MatSnackBar);
  fb = inject(FormBuilder);

  entidades:WritableSignal<Entidad[]>=signal([]);
  entidadList:Signal<Entidad[]>=computed(this.entidades);

  cargos:WritableSignal<Cargo[]>=signal([]);
  cargoList:Signal<Cargo[]>=computed(this.cargos);

  tiposEntidades:WritableSignal<TipoEntidad[]|any>=signal([]);
  tipoEntidadList:Signal<TipoEntidad[]>=computed(this.tiposEntidades);
  _tiposEntidades:TipoEntidad[]=[];

  dependencias:WritableSignal<Dependencia[]>=signal([]);
  dependenciasList:Signal<Dependencia[]>=computed(this.dependencias);

  sexos:WritableSignal<Sexo[]>=signal([]);
  sexoList:Signal<Sexo[]>=computed(this.sexos);

  pag!:Paginacion;

  modalActivo!: ModalInterface;
  modalCreateUser!: ModalInterface;
  PostType?:string;
  text:string = 'Agregar';  

  modeloEntidad = signal<Entidad|null>(null);

  sexoIdF!:number;

  countryControl = new FormControl();

  teForm!:FormGroup;
  dropdownSettings: any = {};
  disabled = false;
  ShowFilter = false;
  limitSelection = false;
  selectedItems= [];
  tipoEntidadItems:TipoEntidad []|any;

  @ViewChild(ModalDeleteComponent) modal!: ModalDeleteComponent;

  @ViewChild('inputRef') inputElement: any;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

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

  GetListIndex(pag:number)
  {
   this.entidadService.getList(pag)
   .subscribe({
     next: (res)=> {

       this.pag=res.paginacion;

       const entidads=res.listModel.map(item=>({
         id:item.id,
         codigo :item.codigo,
         fechaIngreso:item.fechaIngreso,
         persona:item.persona,
         cargo: item.cargo,
         tipoEntidad: item.tipoEntidad,
         dependencia: item.dependencia
       }));
     
       this.entidades.set(entidads);
     
     },
     error: (error) =>{
       console.error("Error", error);
     }
   });
  }

  ngOnInit(): void {
    initFlowbite();
    this.GetListIndex(0);
  }

 //-------------- Paginacion Inicio ---------------------------
  previousPage()
  {
    if(this.pag.paginasAnteriores==true)
      {
        this.GetListIndex(this.pag.paginaInicio-1);
      }
  }

  nextPage()
  {
    if(this.pag.paginasPosteriores==true)
      {
        this.GetListIndex(this.pag.paginaInicio+1);
      }
  }

  //---------------Paginacion fin --------------------------------
  
 
  openCreateUser(model: Entidad,modalNombre:string)
  {
    this.userForm.controls['nombres'].setValue(''+model.persona?.nombres);
    this.userForm.controls['apellidos'].setValue(''+model.persona?.apellidos);
    this.userForm.controls['entidadId'].setValue(model.id);
    this.userForm.get('nombres')?.disable();
    this.userForm.get('apellidos')?.disable();
    this.userForm.get('id')?.disable();

    this.modalCreateUser = this.modalService.createModal(modalNombre);
    this.modalCreateUser.show();
  }

  callChildMethod(modelo: Entidad) {

    if(this.modal){
      this.modal.openModal();
    }
    this.modeloEntidad.set(modelo);
  }

  openModalEdit(entidad: Entidad, typeModal: string)
  {
    this._tiposEntidades=[];
    this.GetListCargo();
    this.GetListTipoEntidad();
    this.GetListDependencia();
    this.GetListSexo();

    this.text = 'Editar';
    this.PostType = 'edit';

    var entres = this.tipoEntidadService.getListByIdEntidad(entidad.id,'').subscribe({
      next:(res)=>{
        const ar=res.data?.map(item=>
          this._tiposEntidades.push(item)
        );

       //this._tiposEntidades=ar;

      }
    });

    this.entidadForm.controls['id'].setValue(''+entidad.id);
    this.entidadForm.controls['dni'].setValue(''+entidad.persona?.dni);
    this.entidadForm.controls['codigo'].setValue(''+entidad.codigo);
    this.entidadForm.controls['nombres'].setValue(''+entidad.persona?.nombres);
    this.entidadForm.controls['apellidos'].setValue(''+entidad.persona?.apellidos);
    this.entidadForm.controls['fechaIngreso'].setValue(''+this.formatearFecha(new Date(entidad.fechaIngreso)));
    this.entidadForm.controls['sexoId'].setValue(''+entidad.persona?.sexoId);
  
   this.entidadForm.controls['cargoId'].setValue(''+entidad.cargo?.id);
    //this.entidadForm.controls['tipoEntidadId'].setValue(''+entidad.tipoEntidad?.id);
    this.entidadForm.controls['dependenciaId'].setValue(''+entidad.dependencia?.id);
    this.modalActivo = this.modalService.createModal('static-modal');
    this.modalActivo.show();
  }

  formatearFecha(fechaString:Date) {
    const fecha = new Date(fechaString);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son base 0
    const anio = fecha.getFullYear();

    return `${anio}-${mes}-${dia}`;
}

  openModal()
  {
    this.GetListCargo();
    this.GetListTipoEntidad();
    this.GetListDependencia();
    this.GetListSexo();


     //this.selectedItems= this.tipoEntidadItems;
     this.dropdownSettings = {
        singleSelection: false,
        idField: 'id',
        textField: 'nombre',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        allowSearchFilter: this.ShowFilter
      };

      this.teForm = this.fb.group({
        te: [this.selectedItems]
      });

    this.text = 'Agregar';
    this.PostType = 'add';
    this.modalActivo = this.modalService.createModal('static-modal');
    this.modalActivo.show();

  }

  closeModal(){
    this.entidadForm.reset();
    this._tiposEntidades=[];  
    this.modalActivo.hide();
  }
  

  closeUserModal(){
    this.entidadForm.reset();

    this.modalCreateUser.hide();
  }
 

  onSubmitUser()
  {
    if(this.userForm.valid)
      {
       

        const usuarioNet: InsertUsuario = this.userForm.value as InsertUsuario;
       
        this.usuarioService.registerUser(usuarioNet).subscribe({
          next: u=>{
            this.userForm.reset();
            this.closeUserModal();
            this.matSnackBar.open("Dato guardado correctamente",'Cerrar',{ duration:5000, horizontalPosition:'center'});

          },
          error: (error) => { 

            if(error.error.errors.ConfirmPassword!=null)
              this.matSnackBar.open(error.error.errors.ConfirmPassword,'Cerrar',{ duration:5000, horizontalPosition:'center'})

            if(error.error.errors.Password!=null)
              this.matSnackBar.open(error.error.errors.Password,'Cerrar',{ duration:5000, horizontalPosition:'center'})

            if(error.error.errors.Email!=null)
             this.matSnackBar.open(error.error.errors.Email,'Cerrar',{ duration:5000, horizontalPosition:'center'})

           
            if(error.error=!0)
              this.matSnackBar.open('Puede que el correo ya este registrado','Cerrar',{ duration:5000, horizontalPosition:'center'})
           }
          

        });
      }
  }

  onSubmit()
  {
    var arr=this.entidadService.convertirAGrupoAObjeto(this.entidadForm);

    arr.tipoEntidadId=this._tiposEntidades;
  
    if(this.PostType == 'add')
      {
      this.entidadService.post(arr).subscribe({
      next: (response) => {
        this.matSnackBar.open("Dato guardado correctamente",'Cerrar',{ duration:5000, horizontalPosition:'center'});
        this.entidadForm.reset();
        this.GetListIndex(1);
      },
      error: (error) => { this.matSnackBar.open("Error al guardar los datos",'Cerrar',{ duration:5000, horizontalPosition:'center'}) }
    });
  }
    else{

      var arr=this.entidadService.convertirAGrupoAObjeto(this.entidadForm);

      arr.tipoEntidadId=this._tiposEntidades;

      this.entidadService.put(arr).subscribe({
        next: (response) => {
          this.matSnackBar.open("Dato modificado correctamente",'Cerrar',{ duration:5000, horizontalPosition:'center'}).afterDismissed().subscribe({
            next:(s) =>{
              this.closeModal()
            }
          })
          this.GetListIndex(1);
        },
        error: (error) => {this.matSnackBar.open("Error al modificar los datos",'Cerrar',{ duration:5000, horizontalPosition:'center'}) }
      });
    }
  }

  onDelete(event: any)
  {
    this.entidadService.eliminar(this.modeloEntidad()).subscribe({
      next: (value) => {
        this.matSnackBar.open("Dato eliminado correctamente!",'Cerrar',{ duration:5000, horizontalPosition:'center'});
        this.GetListIndex(1);
      },
      error: (err) =>{
        this.matSnackBar.open("Error al eliminar el dato",'Cerrar',{ duration:5000, horizontalPosition:'center'})
      },
    })
    
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

  irPerfil(idEntidad:number) {
    this.router.navigate(['/admin/perfilEntidad',idEntidad]);
  }

  irInputEntidad() {
    this.router.navigate(['/admin/inputEntidad']);
  }


}

