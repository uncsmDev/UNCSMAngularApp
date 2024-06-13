import { InstrumentoService } from './../../../Services/instrumento.service';
import { Component, ViewChild, computed, inject, signal } from '@angular/core';
import { TitleComponent } from '../../../shared/title/title.component';
import { ModalService } from '../../../Services/modal.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalDeleteComponent } from '../../../components/modal-delete/modal-delete.component';
import { ModalInterface } from 'flowbite';
import { TipoEntidad } from '../../../interfaces/tipoEntidad';
import { TipoEvaluacion } from '../../../interfaces/tipo_evaluacion';
import { Instrumento, tipoPregunta } from '../../../interfaces/instrumento';
import { DatosInstrumentos } from '../../../interfaces/datos_instrumentos';
import { Dimension } from '../../../interfaces/dimension';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-instrumento',
  standalone: true,
  imports: [TitleComponent, ModalDeleteComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './instrumento.component.html',
  styleUrl: './instrumento.component.css'
})
export default class InstrumentoComponent {

  modalService = inject(ModalService);
  matSnackBar=inject(MatSnackBar);
  fb = inject(FormBuilder);
  instrumentoService = inject(InstrumentoService);
  
  //Instancia del Modal
  modalActivo!: ModalInterface;

  PostType?:string;
  text:string = 'Agregar';
  
  tipoPregunta = tipoPregunta;

  instrumentoForm = this.fb.group({
    id: [0, [Validators.required]],
    nombre: ['', [Validators.required]],
    tipoEntidadId: [0, [Validators.required]],
    tipoEvaluacionId: [0, [Validators.required]]
  });

  simpleItems =[true, 'Two', 3];
  selectedSimpleItem = 'Two';
  
  preguntaForm = this.fb.group({
    id: [0, [Validators.required]],
    Nombre: ['', [Validators.required]],
    InstrumentoId: [0, [Validators.required]],
    DimesionId: [0, [Validators.required]],
    tipoPregunta: [0, [Validators.required]]
  });

  _instrumentos = signal<Instrumento[]>([]); 
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
  //Componente Modal de Eliminar
  @ViewChild(ModalDeleteComponent) modal!: ModalDeleteComponent;

  ngOnInit() {
    this.instrumentoService.getTipoEntidad().subscribe({
      next: (result) => {
        this.tipoEntidades.set(result);
      }
    });
  this.instrumentoService.get().subscribe({
    next: (datos) => {
      this._instrumentos.set(datos);
    }
  })
  }
  

  openModal()
  {
    this.reset()
    this.instrumentoService.getTipoEvaluacion().subscribe({
      next: (result) => {
        this.tipoEvaluaciones.set(result);
      }
    });

    this.text = 'Agregar';
    this.PostType = 'add';
    this.modalActivo = this.modalService.createModal('static-modal');
    this.modalActivo.show();
  }
  

  openModalEdit(instrumento: Instrumento)
  {
    this.reset()
    this.instrumentoService.getTipoEvaluacion().subscribe({
      next: (result) => {
        this.tipoEvaluaciones.set(result);
      }
    });
    this.text = 'Editar';
    this.PostType = 'edit';
    this.instrumentoForm.controls['id'].setValue(instrumento.id);
    this.instrumentoForm.controls['nombre'].setValue(''+instrumento.nombre);
    this.instrumentoForm.controls['tipoEntidadId'].setValue(instrumento.tipoEntidadId);
    this.instrumentoForm.controls['tipoEvaluacionId'].setValue(instrumento.tipoEvaluacionId);
    this.modalActivo = this.modalService.createModal('static-modal');
    this.modalActivo.show();
  }

  onSubmit(){
   if(this.instrumentoForm.valid)
      {
        const instrumento: Instrumento = this.instrumentoForm.value as Instrumento;
        if(this.PostType == 'add')
        {
          this.instrumentoService.post(instrumento).subscribe({
            next: a => {
              if(a)
                {
                  this.reset()
                  this._instrumentos.update((prev) => {
                    return [...prev, {...instrumento, id: a}]
                  })
                  
                  this.tipoEntidades();
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
        this.instrumentoService.put(instrumento).subscribe({
          next: (res) =>{
            debugger
            if(res){
              this._instrumentos.update((arr) => {
                return arr.map((dato)=>{
                  debugger
                  return instrumento.id == dato.id ? 
                  {...dato, nombre: instrumento.nombre, tipoEntidadId: instrumento.tipoEntidadId,
                    tipoEvaluacionId: instrumento.tipoEvaluacionId} 
                  : 
                  dato
                })
              })
              this.closeModal()
              this.matSnackBar.open("Dato modificado correctamente",'Cerrar',{ duration:5000, horizontalPosition:'center'});
            }
            else{
              this.matSnackBar.open("Error al intentar editar el dato",'Cerrar',{ duration:5000, horizontalPosition:'center'});
            }
          },
          error: (err)=>{
            debugger
            this.matSnackBar.open("Error al intentar editar el dato",'Cerrar',{ duration:5000, horizontalPosition:'center'});
          }
        })
      }

      }

    
  }

  callChildMethod(modelo: Instrumento) {
    if(this.modal){
      this.modal.openModal(); // Llama al método doSomething del componente hijo
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
  closeModal(){
    this.modalActivo.hide();
  }

  openModalAddQuestion()
  {
    this.modalActivo = this.modalService.createModal('modalAdd');
    this.instrumentoService.getDimensiones().subscribe({
      next: (res) => {
        this.dimensiones.set(res);
      }
    })
    this.modalActivo.show();
  }

  reset()
  {
    this.instrumentoForm.reset(
      {
        id: 0,
        nombre: '',
        tipoEntidadId: 0,
        tipoEvaluacionId: 0
      }
    );
  }
}

