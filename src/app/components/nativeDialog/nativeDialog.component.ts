import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-native-dialog',
  imports: [],
  templateUrl: './nativeDialog.component.html',
  styleUrl: './nativeDialog.component.css',
})
export class NativeDialogComponent {
  title = input.required<string>();
  buttonOpen = input.required<string>();
  id = input.required<number>();

  //Evento
  emitterAceptar = output();

  open()
      {
        const dialogo = "#alert-dialog-"+this.id();
        console.log(dialogo)
          const alertDialog = document.querySelector(dialogo) as HTMLDialogElement;
          alertDialog.showModal();
      }

      close(){
        const dialogo = "#alert-dialog-"+this.id();
        const alertDialog = document.querySelector(dialogo) as HTMLDialogElement;
        alertDialog.close();
      }

      aceptarButton(){
        this.emitterAceptar.emit();
      }
 }
