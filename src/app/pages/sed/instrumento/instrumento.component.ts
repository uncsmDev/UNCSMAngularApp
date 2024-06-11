import { Component, ViewChild, computed, inject, signal } from '@angular/core';
import { TitleComponent } from '../../../shared/title/title.component';
import { ModalService } from '../../../Services/modal.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalDeleteComponent } from '../../../components/modal-delete/modal-delete.component';
import { ModalInterface } from 'flowbite';
import { InstrumentoService } from '../../../Services/instrumento.service';
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

  instrumentoForm = this.fb.group({
    id: [0, Validators.required],
    nombre: ['', Validators.required], // Transforma 'nombre' a 'titulo'
    tipoEntidadId: [0, Validators.required],
    tipoEvaluacionId: [0, Validators.required],
    eliminado: [false],  // Initialize with false or any default value
    visible: [true]  // Initialize with true or any default value
  });

  private _instrumentos = signal<Instrumento[]>([]); 
  instrumentos = computed(this._instrumentos);
  tipoEntidades = signal<TipoEntidad[]>([])
  tipoEvaluaciones = signal<TipoEvaluacion[]>([])

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
            this.instrumentoForm.reset();
            this.matSnackBar.open("Dato guardado correctamente",'Cerrar',{ duration:5000, horizontalPosition:'center'});
          }
        });
      }

    
  }
  onDelete(event: any){

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
}
