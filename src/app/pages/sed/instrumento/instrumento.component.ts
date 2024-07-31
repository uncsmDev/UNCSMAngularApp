import { InstrumentoService } from '@services/sed/instrumento.service';
import { Component, computed, inject, input, signal, viewChild } from '@angular/core';
import { TitleComponent } from '../../../shared/title/title.component';
import { ModalService } from '@services/modal.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalDeleteComponent } from '../../../components/modal-delete/modal-delete.component';
import { TipoEntidad } from '@interfaces/tipoEntidad';
import { TipoEvaluacion } from '@interfaces/tipo_evaluacion';
import { Instrumento, tipoModal} from '@interfaces/instrumento';
import { DatosInstrumentos } from '@interfaces/datos_instrumentos';
import { Dimension } from '@interfaces/dimension';
import { CommonModule } from '@angular/common';
import { ModalInstrumentoComponent } from './modal-instrumento/modal-instrumento.component';
import { EmiterResult, TipoFormulario } from '@interfaces/EmiterResult';
import { Router, RouterLink } from '@angular/router';
import { DimensionService } from '@services/sed/dimension.service';
import { FlowbitSharedService } from '@services/flowbit-shared.service';
import { ModalDimensionesComponent } from "./modal-dimensiones/modal-dimensiones.component";

@Component({
  selector: 'app-instrumento',
  standalone: true,
  imports: [TitleComponent, ModalDeleteComponent, ReactiveFormsModule, CommonModule, ModalInstrumentoComponent, RouterLink, ModalDimensionesComponent],
  templateUrl: './instrumento.component.html',
  styleUrl: './instrumento.component.css'
})
export default class InstrumentoComponent {
  matSnackBar=inject(MatSnackBar);
  router = inject(Router);
  fb = inject(FormBuilder);
  instrumentoService = inject(InstrumentoService);
  dimensionService = inject(DimensionService);
  modalService = inject(ModalService);
  flowbitSharedService = inject(FlowbitSharedService);

  idTipoEvaluacion = input<number>(0, {alias: 'id'})

  poperData = {
    titulo: '',
    msg: ''
  }

  PostType:tipoModal = 'add';
  _instrumentos = signal<Instrumento[]>([]); 
  dimensiones = signal<Dimension[]>([]);
  
  instrumentos = computed(()=>{
    const inst = this._instrumentos().filter((values) => 
      {
        //const valor:number = parseInt(this.idTipoEvaluacion()+'', 10)
        return values.tipoEvaluacionId == this.idTipoEvaluacion()
      })
    const tipo = this.tipoEntidades()

    const valuesData = tipo.map((valores) => {
      const instrumento = inst.filter((f) =>{
        return f.tipoEntidadId == valores.id
      })
      return {...valores, instrumento}
    })
    return valuesData;
  });

  tipoEntidades = signal<TipoEntidad[]>([])
  tipoEvaluaciones = signal<TipoEvaluacion[]>([])
  modeloInstrumento = signal<Instrumento|null>(null);
  modeloDimension = signal<Dimension|null>(null);

  modalInstrumento = viewChild.required(ModalInstrumentoComponent);
  modalDimension = viewChild.required(ModalDimensionesComponent);
  modalDelete = viewChild.required(ModalDeleteComponent);
  tipoFormulario: TipoFormulario = 'instrumento';

  ngOnInit() {
    this.instrumentoService.getTipoEntidad().subscribe({
      next: (result) => {
        this.tipoEntidades.set(result);
      }
    });
    
    this.getTipoEvaluacion();
    this.getDimension();
   this.getInstrumento();
  }

  getInstrumento(){
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

  onSubmit(valores:EmiterResult<Instrumento>){
    valores.data.tipoEvaluacionId = this.idTipoEvaluacion();
    if(valores.typeModal == 'add')
    {
      this.instrumentoService.post(valores.data).subscribe({
        next: a => {
          if(a)
            {
              this._instrumentos.update((prev) => {
                return [...prev, {...valores.data, id: a, tipoEvaluacionId: this.idTipoEvaluacion()}]
              })
              this.matSnackBar.open("Dato guardado correctamente",'Cerrar',{ duration:5000, horizontalPosition:'center'});
            }
            else{
              this.matSnackBar.open("Error al intentar guardar el dato aa",'Cerrar',{ duration:5000, horizontalPosition:'center'});
            }
          
        },
        error: (e) => {
          this.matSnackBar.open("Error al intentar guardar el dato" + e,'Cerrar',{ duration:5000, horizontalPosition:'center'});
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
                tipoEvaluacionId: this.idTipoEvaluacion()} 
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
onSubmitDimension(valores:EmiterResult<Dimension>){
  if(valores.typeModal == 'add')
  {
    this.instrumentoService.postDimension(valores.data).subscribe({
      next: a => {
        if(a)
          {
            this._instrumentos.update((prev) => {
              return prev.map((data) => {
                if (data.id === valores.data.instrumentoId) {
                  // Crea una nueva copia del objeto con la propiedad 'dimensiones' actualizada
                  return {
                    ...data,
                    dimensiones: data.dimensiones ? [...data.dimensiones, valores.data] : [valores.data]
                  };
                }
                return data;
              });
            });

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
    }
    this.modeloInstrumento.set(modelo);
  }

  delDimension(dimension: Dimension) {
    if(this.modalDelete()){
      this.modalDelete().openModal(); // Llama al método doSomething del componente hijo
    }
    this.modeloDimension.set(dimension);
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

  getTipoEvaluacion(){
    this.instrumentoService.getTipoEvaluacion().subscribe({
      next: (result) => {
        this.tipoEvaluaciones.set(result);
      }
    });
  }

  /* popper(title: string, msg:string, buttonName:string, placement: "top"|"right"|"bottom"|"left"){
    this.poperData.titulo = title;
    this.poperData.msg = msg;
    this.flowbitSharedService.popper(buttonName, placement);
  } */
  
}

