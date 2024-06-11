import { Component, ViewChild, WritableSignal, computed, inject, signal } from '@angular/core';
import { Escala } from '../../../interfaces/escala';
import { TitleComponent } from '../../../shared/title/title.component';
import { EscalaService } from '../../../Services/sed/escala.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalDeleteComponent } from '../../../components/modal-delete/modal-delete.component';
import { ModalService } from '../../../Services/modal.service';
import { ModalInterface } from 'flowbite';

@Component({
  selector: 'app-escala',
  standalone: true,
  imports: [TitleComponent, ReactiveFormsModule, ModalDeleteComponent],
  templateUrl: './escala.component.html',
  styleUrl: './escala.component.css'
})
export default class EscalaComponent {
  //Componentes Injectados
  escalaService = inject(EscalaService);
  modalService = inject(ModalService);
  matSnackBar=inject(MatSnackBar);
  fb = inject(FormBuilder);

  //Escalas
  escalas: WritableSignal<Escala[]> = signal([]);
  escalasNotEdit = computed(this.escalas);
  
  //Instancia del Modal
  modalActivo!: ModalInterface;

  PostType?:string;
  text:string = 'Agregar';  

  modeloEscala = signal<Escala|null>(null);

  //Componente Modal de Eliminar
  @ViewChild(ModalDeleteComponent) modal!: ModalDeleteComponent;

  
  escalaForm = this.fb.group({
    id : [''],
    nombre: ['', Validators.required], // Transforma 'nombre' a 'titulo'
    simbologia: ['', Validators.required],
    valoracion: ['', Validators.required],
    nivelcumplimiento: ['', Validators.required]
  });

  callChildMethod(modelo: Escala) {
    if(this.modal){
      this.modal.openModal(); // Llama al método doSomething del componente hijo
    }
    this.modeloEscala.set(modelo);
  }

  ngOnInit() {
    this.getDatos();
  }

  getDatos()
  {
    this.escalaService.get()
    .subscribe({
      next: (resp)=> {
        const mod = resp.map(item => ({
          id: item.id,
          nombre: item.nombre, // Transforma 'nombre' a 'titulo'
          simbologia: item.simbologia,
          valoracion: item.valoracion,
          nivelCumplimiento: item.nivelCumplimiento,
          eliminado: item.eliminado,
          visible: item.visible,
        }));

        this.escalas.set(mod);
      },
      error: (error) =>{ this.matSnackBar.open("Error al obtener los datos",'Cerrar',{ duration:5000, horizontalPosition:'center'}) }
    })
  }
  
  onSubmit(){

    if(this.PostType == 'add')
      {

    this.escalaService.post(this.escalaService.convertirAGrupoAObjeto(this.escalaForm)).subscribe({
      next: (response) => {
        this.matSnackBar.open("Dato guardado correctamente",'Cerrar',{ duration:5000, horizontalPosition:'center'});
        this.escalaForm.reset();
        this.getDatos()
      },
      error: (error) => { this.matSnackBar.open("Error al guardar los datos",'Cerrar',{ duration:5000, horizontalPosition:'center'}) }
    });
  }
    else{
      this.escalaService.put(this.escalaService.convertirAGrupoAObjeto(this.escalaForm)).subscribe({
        next: (response) => {
          this.matSnackBar.open("Dato modificado correctamente",'Cerrar',{ duration:5000, horizontalPosition:'center'}).afterDismissed().subscribe({
            next:(s) =>{
              this.closeModal()
            }
          })
          this.getDatos()
        },
        error: (error) => {this.matSnackBar.open("Error al modificar los datos",'Cerrar',{ duration:5000, horizontalPosition:'center'}) }
      });
    }
  }

  onDelete(event: any)
  {
    this.escalaService.delete(this.modeloEscala()).subscribe({
      next: (value) => {
        this.matSnackBar.open("Dato eliminado correctamente!",'Cerrar',{ duration:5000, horizontalPosition:'center'});
        this.getDatos()
      },
      error: (err) =>{
        this.matSnackBar.open("Error al eliminar el dato",'Cerrar',{ duration:5000, horizontalPosition:'center'})
      },
    })
    
  }

  openModal()
  {
    this.text = 'Agregar';
    this.PostType = 'add';
    this.modalActivo = this.modalService.createModal('static-modal');
    this.modalActivo.show();
  }

  openModalEdit(escala: Escala, typeModal: string)
  {
    this.text = 'Editar';
    this.PostType = 'edit';
    this.escalaForm.controls['id'].setValue(''+escala.id);
    this.escalaForm.controls['nombre'].setValue(''+escala.nombre);
    this.escalaForm.controls['simbologia'].setValue(''+escala.simbologia);
    this.escalaForm.controls['valoracion'].setValue(''+escala.valoracion);
    this.escalaForm.controls['nivelcumplimiento'].setValue(''+escala.nivelCumplimiento);
    this.modalActivo = this.modalService.createModal('static-modal');
    this.modalActivo.show();
  }

  closeModal(){
    this.modalActivo.hide();
  }
  
}
