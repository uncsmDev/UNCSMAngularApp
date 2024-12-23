import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, inject, input, OnInit, output  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ArchivoService } from '../../../Services/admin/archivo.service';
import { SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-fdropzone',
    imports: [FormsModule, CommonModule],
    templateUrl: './fdropzone.component.html',
    styleUrl: './fdropzone.component.css'
})
export class FdropzoneComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  img = input.required<SafeUrl | null>();
  archivoService=inject(ArchivoService);
  imgEmit = output<string | ArrayBuffer>();

  imageUrl!: string;
  
  ngOnInit(): void {
    console.log(this.img());
  }

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
    this.archivo=file;

    reader.onload = (e: any) => {
      this.previewImage = e.target.result;
      this.imgEmit.emit(this.previewImage);
    };
    reader.readAsDataURL(file);
  }
}
