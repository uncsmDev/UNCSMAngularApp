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
import { Instrumento } from '../../../interfaces/instrumento';

@Component({
  selector: 'app-instrumento',
  standalone: true,
  imports: [TitleComponent, ModalDeleteComponent, ReactiveFormsModule],
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
  
  tipoPregunta = [{
    id: 0,
    nombre: 'Abierta', 
    descripcion: 'Este tipo de preguntas no tiene una respuesta fija, lo que permite obtener una amplia variedad de respuestas.'
  },
  {id: 1,
    nombre: 'Cerrada',descripcion:  'Este tipo de preguntas facilita la recopilación de datos cuantitativos y permite una comparación más fácil.'}];

  instrumentoForm = this.fb.group({
    id: [0, [Validators.required]],
    nombre: ['', [Validators.required]],
    tipoEntidadId: [0, [Validators.required]],
    tipoEvaluacionId: [0, [Validators.required]],
    eliminado: [false], 
    visible: [true]
  });

  private _instrumentos = signal<Instrumento[]>([]); 
  instrumentos = computed(this._instrumentos);
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
  
  getTipoPregunta(id:number)
  {
    return this.tipoPregunta.find((a) =>a.id === id)
  }

  openModal()
  {
    
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

  

  onSubmit(){

   if(this.instrumentoForm.valid)
      {
        const instrumento: Instrumento = this.instrumentoForm.value as Instrumento;
        this.instrumentoService.post(instrumento).subscribe({
          next: a => {
            this.reset()
            console.log(this.instrumentoForm)
            this.matSnackBar.open("Dato guardado correctamente",'Cerrar',{ duration:5000, horizontalPosition:'center'});
          }
        });
      }

    
  }
  
  callChildMethod(modelo: Instrumento) {
    if(this.modal){
      this.modal.openModal(); // Llama al método doSomething del componente hijo
    }
    this.modeloInstrumento.set(modelo);
  }

  onDelete(){
    debugger
    this.instrumentoService.delete(this.modeloInstrumento()).subscribe(
      {
        next: (res) => {
          this.matSnackBar.open("Dato eliminado correctamente!",'Cerrar',{ duration:5000, horizontalPosition:'center'});
          this._instrumentos.update((valor) => {
            return valor.filter((dato) => dato.id !== this.modeloInstrumento()!.id);
          })
        }
      }
    )
  }
  closeModal(){
    this.modalActivo.hide();
  }

  openModalAddQuestion()
  {

    this.text = 'Agregar';
    this.PostType = 'add';
    this.modalActivo = this.modalService.createModal('modalAdd');
    this.modalActivo.show();
  }

  reset()
  {
    this.instrumentoForm.reset(
      {
        id: 0,
        nombre: '',
        tipoEntidadId: 0,
        tipoEvaluacionId: 0,
        eliminado: false,
        visible: true
      }
    );
  }
}

