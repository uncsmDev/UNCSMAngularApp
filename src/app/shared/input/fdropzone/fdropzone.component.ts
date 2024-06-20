import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, inject  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ArchivoService } from '../../../Services/admin/archivo.service';

@Component({
  selector: 'app-fdropzone',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './fdropzone.component.html',
  styleUrl: './fdropzone.component.css'
})
export class FdropzoneComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  archivoService=inject(ArchivoService);


  imageUrl!: string;
  

  public archivo:any=[];

  previewImage: string | ArrayBuffer = '';


  onFileSelected(event:Event) {
    const file =(<HTMLInputElement>event.target).files // (event.target as HTMLInputElement).files[0];
    if (file) {
      this.preview(file[0]);
      this.archivoService.file=file[0];
    }
  }

  preview(file:any): void {
    const reader = new FileReader();
    console.log('File:', file);
    this.archivo=file;

    reader.onload = (e: any) => {
      this.previewImage = e.target.result;
    };
    reader.readAsDataURL(file);
    console.log('reader :', reader);
  }


  
}
