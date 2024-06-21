import { ModalPreguntaComponent } from './../modal-pregunta/modal-pregunta.component';
import { InstrumentoService } from '@services/sed/instrumento.service';
import { Component, ViewChild, computed, inject, signal, viewChild } from '@angular/core';
import { TitleComponent } from '../../../shared/title/title.component';
import { ModalService } from '@services/modal.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalDeleteComponent } from '../../../components/modal-delete/modal-delete.component';
import { ModalInterface } from 'flowbite';
import { TipoEntidad } from '@interfaces/tipoEntidad';
import { TipoEvaluacion } from '@interfaces/tipo_evaluacion';
import { Instrumento, tipoModal} from '@interfaces/instrumento';
import { DatosInstrumentos } from '@interfaces/datos_instrumentos';
import { Dimension } from '@interfaces/dimension';
import { CommonModule } from '@angular/common';
import { Pregunta } from '@interfaces/pregunta';
import { TipoPregunta } from '@interfaces/tipo_pregunta';
import { ModalInstrumentoComponent } from './modal-instrumento/modal-instrumento.component';
import { EmiterResult } from '@interfaces/EmiterResult';

@Component({
  selector: 'app-instrumento',
  standalone: true,
  imports: [TitleComponent, ModalDeleteComponent, ReactiveFormsModule, CommonModule, ModalInstrumentoComponent, ModalPreguntaComponent],
  templateUrl: './instrumento.component.html',
  styleUrl: './instrumento.component.css'
})
export default class InstrumentoComponent {
  matSnackBar=inject(MatSnackBar);
  fb = inject(FormBuilder);
  instrumentoService = inject(InstrumentoService);
  
  modalService = inject(ModalService);
  //Instancia del Modal
  modalActivo!: ModalInterface;

  PostType:tipoModal = 'add';
  text:string = 'Agregar';
  
  tipoPregunta = signal<TipoPregunta[]>([]);


  simpleItems =[true, 'Two', 3];
  selectedSimpleItem = 'Two';
  
  

  _instrumentos = signal<Instrumento[]>([]); 
  preguntas = signal<Pregunta[]>([]); 
  dimensiones = signal<Dimension[]>([]);
  
  instrumentos = computed(()=>{
    const inst = this._instrumentos();
    const tipo = this.tipoEntidades();

    const dato:DatosInstrumentos | any = []

    tipo.forEach((a) => {
      dato.push(
        {
          tipo: a,
          instrumentos: inst.filter((c) => c.tipoEntidadId == a.id)
        }
      )
    })
    return dato;
  });

  tipoEntidades = signal<TipoEntidad[]>([])
  tipoEvaluaciones = signal<TipoEvaluacion[]>([])
  modeloInstrumento = signal<Instrumento|null>(null);

  modalInstrumento = viewChild.required(ModalInstrumentoComponent);
  modalPreguntas = viewChild.required(ModalPreguntaComponent);
  modalDelete = viewChild.required(ModalDeleteComponent);

  ngOnInit() {
    this.instrumentoService.getTipoEntidad().subscribe({
      next: (result) => {
        this.tipoEntidades.set(result);
      }
    });
    
    this.getTipoEvaluacion();
    this.instrumentoService.get().subscribe({
      next: (datos) => {
        this._instrumentos.set(datos);
      }
    })
  }
  
  openModal()
  {
    this.PostType = 'add';
    this.modalInstrumento().openModal();
  }
  
  openModalEdit(instrumento: Instrumento)
  {
    this.PostType = 'edit';
    this.modeloInstrumento.set(instrumento);
    this.modalInstrumento().openModalEdit();
  }

  onSubmit(valores:EmiterResult<Instrumento>){
    if(valores.typeModal == 'add')
    {
      this.instrumentoService.post(valores.data).subscribe({
        next: a => {
          if(a)
            {
              this._instrumentos.update((prev) => {
                return [...prev, {...valores.data, id: a}]
              })
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
    this.instrumentoService.put(valores.data).subscribe({
      next: (res) =>{
        if(res){
          this._instrumentos.update((arr) => {
            return arr.map((dato)=>{
              return valores.data.id == dato.id ? 
              {...dato, nombre: valores.data.nombre, tipoEntidadId: valores.data.tipoEntidadId,
                tipoEvaluacionId: valores.data.tipoEvaluacionId} 
              : 
              dato
            })
          })
          this.modalInstrumento().closeModal();
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
  onSubmitQuestion(valores:EmiterResult<Pregunta>){
         if(valores.typeModal == 'add')
         {
           this.instrumentoService.postQuestion(valores.data).subscribe({
             next: a => {
              debugger
               if(a)
                 {
                  // this.reset()
                   this.preguntas.update((prev) => {
                     return [...prev, {...valores.data, id: a}]
                   })
                   
                   this.tipoEntidades();
                   this.getTipoPregunta();
                   this.matSnackBar.open("Dato guardado correctamente",'Cerrar',{ duration:5000, horizontalPosition:'center'});
                 }
                 else{
                   this.matSnackBar.open("Error al intentar guardar el dato",'Cerrar',{ duration:5000, horizontalPosition:'center'});
                 }
               
             },
             error: (e) => {
              debugger
               this.matSnackBar.open("Error al intentar guardar el dato ",'Cerrar',{ duration:5000, horizontalPosition:'center'});
               console.log(e);
             }
           });
       }
       else{
         this.instrumentoService.putQuestion(valores.data).subscribe({
           next: (res) =>{
             if(res){
               this._instrumentos.update((arr) => {
                 return arr.map((dato)=>{
                   return valores.data.id == dato.id ? 
                   {...dato, nombre: valores.data.nombre, tipoPregunta: valores.data.tipoPreguntaId,
                    instrumentoId: valores.data.instrumentoId, dimesionId: valores.data.dimesionId} 
                   : 
                   dato
                 })
               })
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
    }
    this.modeloInstrumento.set(modelo);
  }

  onDelete(){
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

  openModalAddQuestion(ins: Instrumento)
  {
    this.PostType = 'add'
    this.getDimension();
    this.getTipoPregunta();
    this.modeloInstrumento.set(ins);
    this.modalPreguntas().openModalAddQuestion();
  }

  getDimension(){
    this.instrumentoService.getDimensiones().subscribe({
      next: (res) => {
        this.dimensiones.set(res);
      }
    })
  }

  getTipoPregunta(){
    this.instrumentoService.getTipoPregunta().subscribe({
      next: (res) => {
        this.tipoPregunta.set(res);
      },
      error: (e) => {

      }
    })
  }

  getPregunta(){
    this.instrumentoService.getPreguntas().subscribe({
      next: (res) => {
        this.preguntas.set(res);
        console.log(this.preguntas());
      },
      error: (e) => {

      }
    })
  }

  getTipoEvaluacion(){
    this.instrumentoService.getTipoEvaluacion().subscribe({
      next: (result) => {
        this.tipoEvaluaciones.set(result);
      }
    });
  }

  
}

