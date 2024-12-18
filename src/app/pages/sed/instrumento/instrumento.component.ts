import { InstrumentoService } from '@services/sed/instrumento.service';
import { Component, computed, inject, input, signal, viewChild } from '@angular/core';
import { TitleComponent } from '../../../shared/title/title.component';
import { ModalService } from '@services/modal.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalDeleteComponent } from '../../../components/modal-delete/modal-delete.component';
import Swal from 'sweetalert2'
import { Instrumento, postDelete, tipoModal} from '@interfaces/instrumento';
import { Dimension } from '@interfaces/dimension';
import { CommonModule, Location } from '@angular/common';
import { ModalInstrumentoComponent } from './modal-instrumento/modal-instrumento.component';
import { EmiterResult, TipoFormulario } from '@interfaces/EmiterResult';
import { Router, RouterLink } from '@angular/router';
import { DimensionService } from '@services/sed/dimension.service';
import { FlowbitSharedService } from '@services/flowbit-shared.service';
import { ModalDimensionesComponent } from "./modal-dimensiones/modal-dimensiones.component";
import { TipoTrabajador } from '@interfaces/tipoEntidad';
import { TipoTrabajadorService } from '@services/admin/tipoTrabajador.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { SweetalertService } from '@services/sweetalert.service';

@Component({
    selector: 'app-instrumento',
    imports: [TitleComponent, ModalDeleteComponent, ReactiveFormsModule, CommonModule, ModalInstrumentoComponent, RouterLink, ModalDimensionesComponent],
    templateUrl: './instrumento.component.html',
    styleUrl: './instrumento.component.css'
})
export default class InstrumentoComponent {

  TipoEvaluacionId = input<number>(0, {alias: 'TipoEvaluacionId'})
  TipoTrabajadorId = input<number>(0, {alias: 'TipoTrabajadorId'})

  matSnackBar=inject(MatSnackBar);
  router = inject(Router);
  fb = inject(FormBuilder);
  instrumentoService = inject(InstrumentoService);
  tipoTrabajadorSvc = inject(TipoTrabajadorService);
  dimensionService = inject(DimensionService);
  modalService = inject(ModalService);
  flowbitSharedService = inject(FlowbitSharedService);
  location = inject(Location);
  sweetalert = inject(SweetalertService);
  poperData = {
    titulo: '',
    msg: ''
  }
  private previousValue= signal <number | null>(null); 
  PostType:tipoModal = 'add';
  postDelete: postDelete = 'instrumento';

  _instrumentos = signal<Instrumento[]>([]);
  tipoTrabajadorSignal = signal<TipoTrabajador>({} as TipoTrabajador); 
  dimensiones = signal<Dimension[]>([]);

  modeloInstrumento = signal<Instrumento|null>(null);
  modeloDimension = signal<Dimension|null>(null);

  modalInstrumento = viewChild.required(ModalInstrumentoComponent);
  modalDimension = viewChild.required(ModalDimensionesComponent);
  modalDelete = viewChild.required(ModalDeleteComponent);
  tipoFormulario: TipoFormulario = 'instrumento';

  ngOnInit() {
    this.getDimension();
    this.getInstrumento();
    this.getTipoTrabajador();
  }

getTipoTrabajador(){
this.tipoTrabajadorSvc.getOne(this.TipoTrabajadorId()).subscribe({
  next: (data) => {
    this.tipoTrabajadorSignal.set(data.data!);
  }
})
}
  getInstrumento(){
    this.instrumentoService.GetxTipoTrabajadorxTipoEvaluacion(this.TipoEvaluacionId(), this.TipoTrabajadorId()).subscribe({
      next: (datos) => {
        this._instrumentos.set(datos.data);

        this._instrumentos().forEach(instrumento => {
          if(instrumento.habilitar == true){
            this.previousValue.set(instrumento.id);
          }
        })
      }
    })
  }
  openModal()
  {
    this.PostType = 'add';
    this.modalInstrumento().openModal();
  }

  openModalDimensiones(idInstrumento: number)
  {
    this.PostType = 'add';
    this.modalDimension().openModal(idInstrumento);
  }
  
  openModalEdit(instrumento: Instrumento)
  {
    this.PostType = 'edit';
    this.modeloInstrumento.set(instrumento);
    this.modalInstrumento().openModalEdit(this.modeloInstrumento());
  }

  openModalDimensionesEdit(dimension: Dimension){
    this.PostType = 'edit';
    this.modeloDimension.set(dimension);
    this.modalDimension().openModalEdit(this.modeloDimension())
  }

  onSubmit(valores:EmiterResult<Instrumento | null>){
    if(valores.data == null)
    {
        this.matSnackBar.open("Error al intentar guardar el dato",'Cerrar',{ duration:5000, horizontalPosition:'center'});
    }
    else if(valores.typeModal == 'add')
    {
        const instrumentoData = valores.data!;
         this._instrumentos.update((prev) => {
            return [instrumentoData, ...prev]
          })
          this.matSnackBar.open("Dato guardado correctamente",'Cerrar',{ duration:5000, horizontalPosition:'center'});
    }
    else if(valores.typeModal == 'edit'){
      this._instrumentos.update((arr) => arr.map((dato)=>{
          return valores.data?.id == dato.id ? 
          {...dato, nombre: valores.data.nombre} 
          : 
          dato
        }))
    }
  }     
onSubmitDimension(valores:EmiterResult<Dimension>){
  if(valores.typeModal == 'add')
  {
    this.instrumentoService.postDimension(valores.data).subscribe({
      next: a => {
        if(a)
          {
            this.getInstrumento()
            this.matSnackBar.open("Dato guardado correctamente",'Cerrar',{ duration:5000, horizontalPosition:'center'});
          }
          else{
            this.matSnackBar.open("Error al intentar guardar el dato",'Cerrar',{ duration:5000, horizontalPosition:'center'});
          }
        
      },
      error: (e) => {
        this.matSnackBar.open("Error al intentar guardar el dato",'Cerrar',{ duration:5000, horizontalPosition:'center'});
      }
    });
}
else{
  this.instrumentoService.putDimension(valores.data).subscribe({
    next: (res) =>{
      if(res){
        this.getInstrumento()
        this.modalDimension().closeModal();
        this.matSnackBar.open("Dato modificado correctamente",'Cerrar',{ duration:5000, horizontalPosition:'center'});
      }
      else{
        this.matSnackBar.open("Error al intentar editar el dato",'Cerrar',{ duration:5000, horizontalPosition:'center'});
      }
    },
    error: (err)=>{
      this.matSnackBar.open("Error al intentar editar el dato",'Cerrar',{ duration:5000, horizontalPosition:'center'});
    } 
  })
}
}     
  callChildMethod(modelo: Instrumento) {
    if(this.modalDelete()){
      this.modalDelete().openModal(); // Llama al método doSomething del componente hijo
      this.postDelete = 'instrumento';
    }
    this.modeloInstrumento.set(modelo);
  }

  delDimension(dimension: Dimension) {
    if(this.modalDelete()){
      this.modalDelete().openModal(); // Llama al método doSomething del componente hijo
      this.postDelete = 'dimension';
    }
    this.modeloDimension.set(dimension);
  }

  onDelete(){
    if(this.postDelete == 'instrumento'){
      this.deletedInstrumento();
    }
    else if(this.postDelete == 'dimension'){
      this.deleteDimension()
    }
    
    this.getInstrumento()
  }

  onChange(event: Event){
    const input = event.target as HTMLInputElement;
    const value = Number.parseInt(input.value);

    this.instrumentoService.putHabilitar(value, this.TipoTrabajadorId(), this.TipoEvaluacionId()).subscribe(
      {
        next: (res) => {
          if(res.data == null){
            Swal.fire({
              title: 'Error!',
              text: 'El instrumento seleccionado, no contiene preguntas agregadas',
              icon: 'error',
              confirmButtonText: 'Ok',
              ...this.sweetalert.theme,
            });
            this.revertToPreviousValue(); 
          }
        }
        
      }
    );
  }

  revertToPreviousValue(): void {
    if (this.previousValue() !== null) {
      const previousRadio = document.querySelector(`input[id="${this.previousValue()}"]`) as HTMLInputElement;
      if (previousRadio) {
        previousRadio.checked = true;  // Restaurar la selección del radio button anterior
      }
    }
  }

  deletedInstrumento(){
    this.instrumentoService.delete(this.modeloInstrumento()).subscribe(
      {
        next: (res) => {
          if(res){
            this.matSnackBar.open("Dato eliminado correctamente!",'Cerrar',{ duration:5000, horizontalPosition:'center'});
            this._instrumentos.update((valor) => {
              return valor.filter((dato) => dato.id !== this.modeloInstrumento()!.id);
            })
          }else{
            this.matSnackBar.open("Error al intentar eliminar el dato!",'Cerrar',{ duration:5000, horizontalPosition:'center'});
          }
          
        },
        error: (a) =>{
          this.matSnackBar.open("Error al intentar eliminar el dato!",'Cerrar',{ duration:5000, horizontalPosition:'center'});
        } 
      }
    )
  }

  deleteDimension(){
    this.instrumentoService.deleteDimension(this.modeloDimension()).subscribe(
      {
        next: (res) => {
          if(res){
            this.matSnackBar.open("Dato eliminado correctamente!",'Cerrar',{ duration:5000, horizontalPosition:'center'});
            this.getInstrumento()
          }else{
            this.matSnackBar.open("Error al intentar eliminar el dato!",'Cerrar',{ duration:5000, horizontalPosition:'center'});
          }
          
        },
        error: (a) =>{
          this.matSnackBar.open("Error al intentar eliminar el dato!",'Cerrar',{ duration:5000, horizontalPosition:'center'});
        } 
      }
    )
  }

  openFormAddQuestion(ins: Instrumento)
  {
    this.router.navigate(['sed/instrumento/', ins.id]);
  }

  getDimension(){
    this.dimensionService.get().subscribe({
      next: (res) => {
        this.dimensiones.set(res);
      }
    })
  }

  /* popper(title: string, msg:string, buttonName:string, placement: "top"|"right"|"bottom"|"left"){
    this.poperData.titulo = title;
    this.poperData.msg = msg;
    this.flowbitSharedService.popper(buttonName, placement);
  } */

    back(){
      this.location.back()
    }
}

