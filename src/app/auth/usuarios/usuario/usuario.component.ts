import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ResultEnum } from '@interfaces/Result.interface';
import { TrabajadorUserDetalle } from '@interfaces/ViewsInterfaces/TrabajadorDetalle';
import { ArchivoService } from '@services/admin/archivo.service';
import { TrabajadorService } from '@services/admin/trabajador.service';
import { SweetalertService } from '@services/sweetalert.service';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { TitleComponent } from 'app/shared/title/title.component';


@Component({
    selector: 'app-usuario',
    imports: [TitleComponent],
    templateUrl: './usuario.component.html',
    styleUrl: './usuario.component.css'
})
export default class UsuarioComponent {

  trabajadorService=inject(TrabajadorService);
  archivoService=inject(ArchivoService);
  sweetalert = inject(SweetalertService);

 /* subModulosByUser:WritableSignal<SubModuloXUserView[]>=signal([]);
  subModuloByUserList:Signal<SubModuloXUserView[]>=computed(this.subModulosByUser);*/

  trabajadorUser:WritableSignal<TrabajadorUserDetalle>=signal({} as TrabajadorUserDetalle);
  trabajUser:Signal<TrabajadorUserDetalle>=computed(this.trabajadorUser);

  constructor(private route: ActivatedRoute,  private sanitizer: DomSanitizer){}

  trabajadorId!: number;
  imageUrl: SafeUrl | undefined;
  
  ngOnInit(): void 
  {
    this.route.params.subscribe(params => {
      this.trabajadorId = params['id'];
    }); 
  
    this.getById();
  
  }

  async getById()
  {
    const rp= await firstValueFrom(this.trabajadorService.getDetalleUser(this.trabajadorId));

    if (rp.status == ResultEnum.Success) 
    {
      this.trabajadorUser.set(rp.data);
      if (this.trabajadorUser().img != null) 
      {
        const file = await firstValueFrom(this.archivoService.getByAddress(this.trabajadorUser().img!));
        console.log(file);

        if (file.size > 0)
        {
          const objectUrl = URL.createObjectURL(file);
          this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
        }
          
      }
      else
      {
        Swal.fire({
          title: 'Advertencia!',
          html: '<p>No se encontro una imagen.</p>',
          icon: 'warning',
          confirmButtonText: 'Ok',
          ...this.sweetalert.theme,
        })
      }

    }
    else{
      Swal.fire({
        title: 'Advertencia!',
        html: '<p>'+rp.message+'.</p>',
        icon: 'warning',
        confirmButtonText: 'Ok',
        ...this.sweetalert.theme,
      })
    }

  }


  CrearUsuario()
  {}

}
