import { Component, Signal, WritableSignal, computed, inject, signal,AfterViewInit, ViewChild, AfterContentInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import {FormsModule,FormBuilder, ReactiveFormsModule, FormGroup} from '@angular/forms';

import type { InstanceOptions, ModalInterface } from 'flowbite';
import { TitleComponent } from '../../../shared/title/title.component';

import { Observable } from 'rxjs';
import { ModuloService } from '../../../Services/modulo.service';
import { Modulo, ModuloView } from '../../../interfaces/modulo';
import { ModalService } from '../../../Services/modal.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import {FdropzoneComponent} from '../../../shared/input/fdropzone/fdropzone.component'
import { ArchivoService } from '../../../Services/admin/archivo.service';
import { Archivo } from '../../../interfaces/archivo';


@Component({
    selector: 'app-modulo',
    standalone: true,
    templateUrl: './modulo.component.html',
    styleUrl: './modulo.component.css',
    imports: [TitleComponent, FormsModule, ReactiveFormsModule, FdropzoneComponent]
})
 

export default class ModuloComponent {

  moduloService=inject(ModuloService);
  modalService = inject(ModalService);
  archivoService=inject(ArchivoService);
 

  modulos:WritableSignal<Modulo[]>=signal([]);
  moduloList:Signal<Modulo[]>=computed(this.modulos);

  modalModulo!: ModalInterface;

  matSnackBar=inject(MatSnackBar);
  fb = inject(FormBuilder);

  PostType?:string;
  text:string = 'Agregar';  

 public model=null;  ///model para inputfile

  ngOnInit(): void {
    initFlowbite();
    this.GetListIndex();
  }

  moduloFormInput=this.fb.group({
    id : 0,
    titulo: [''],
    descripcion : [''],
    path: [''],
    loadComponent: [''],
    fileId:0,
  });

  moduloForm=this.fb.group({
    id : [''],
    titulo: [''],
    descripcion : [''],
    path: [''],
    loadComponent: [''],
    imgLocation : [''],
    subModulos: null,
  });

 
  GetListIndex()
  {
    this.moduloService.getList().subscribe({
      next: (result) => {
        console.log(result);
        this.modulos.set(result);
      }
    });
  }

  constructor()
  {
    
  }
  ///---------------------modals

  openModal()
  {
    this.text = 'Agregar';
    this.PostType = 'add';
    this.modalModulo = this.modalService.createModal('static-modal');
    this.modalModulo.show();
  }


  onSubmit(){
    const moduloIn: ModuloView = this.moduloFormInput.value as unknown as ModuloView;

    if(this.PostType == 'add')
      {
        this.moduloService.post(moduloIn).subscribe({
          next:(res)=>{
          
            const formData = new FormData();
            formData.append('Ubicacion', 'Modulo');
            formData.append('SubCarpeta', 'Imagenes');
            formData.append('File', this.archivoService.file);
            formData.append('ReferenciaId',res.id.toString());
    
            this.archivoService.post(formData).subscribe({
              next:(rsa)=>{
                this.moduloForm.reset();
                this.matSnackBar.open("Dato guardados" ,'Cerrar',{ duration:5000, horizontalPosition:'center'}).afterDismissed().subscribe({
                  next:(s) =>{
                    
                    this.closeModal()
                  }
                });
              },
              error: (error) => {this.matSnackBar.open("Error al guardar",'Cerrar',{ duration:5000, horizontalPosition:'center'}) }
              
            });
          },
          error: (error) => {this.matSnackBar.open("Error al guardar",'Cerrar',{ duration:5000, horizontalPosition:'center'}) }
        });

    }
  }

  closeModal(){
    this.moduloForm.reset();

    this.modalModulo.hide();
  }

}
