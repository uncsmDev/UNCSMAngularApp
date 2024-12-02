import { Component, computed, inject, Signal, signal, WritableSignal,AfterViewInit, ViewChild, viewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ResultEnum } from '@interfaces/Result.interface';
import { ContratoDetalle } from '@interfaces/ViewsInterfaces/ContratoDetalle';
import { TrabajadorDetalle } from '@interfaces/ViewsInterfaces/TrabajadorDetalle';
import { TrabajadorService } from '@services/admin/trabajador.service';
import { TitleComponent } from 'app/shared/title/title.component';
import { SweetalertService } from '@services/sweetalert.service';
import Swal from 'sweetalert2';


import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { AddContratoModalComponent } from '../add-contrato-modal/add-contrato-modal.component';
import { tipoModal } from '@interfaces/trabajador';
import { FinalizaContratoComponent } from '../finaliza-contrato/finaliza-contrato.component';


@Component({
    selector: 'app-contrato',
    imports: [TitleComponent, MatTableModule, MatPaginatorModule, AddContratoModalComponent, FinalizaContratoComponent],
    templateUrl: './contrato.component.html',
    styleUrl: './contrato.component.css'
})
export default class ContratoComponent {

  trabajadorService=inject(TrabajadorService);
  sweetalert = inject(SweetalertService);

  detalleTrabajadorContrato:WritableSignal<TrabajadorDetalle>=signal({} as TrabajadorDetalle);
  ListDetTrabContrato:Signal<TrabajadorDetalle>=computed(this.detalleTrabajadorContrato);

  contratosActivos:WritableSignal<ContratoDetalle[]>=signal([]);
  ListContratosActivos:Signal<ContratoDetalle[]>=computed(this.contratosActivos);
  cA:ContratoDetalle[]=[];

  contratosAdmin:WritableSignal<ContratoDetalle[]>=signal([]);
  ListContratosAdmin:Signal<ContratoDetalle[]>=computed(this.contratosAdmin);
  cAd:ContratoDetalle[]=[];

  contratosDoc:WritableSignal<ContratoDetalle[]>=signal([]);
  ListContratosDoc:Signal<ContratoDetalle[]>=computed(this.contratosDoc);
  cDo:ContratoDetalle[]=[];

  trabajadorId!: number;
  actualizar:boolean=false;

  displayedColumns: string[] = ['cargo', 'dependencia', 'fechaInicio', 'fechaFin'];
  dataSource = new MatTableDataSource<ContratoDetalle>(this.cAd);
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  displayedColumnsDoc: string[] = ['cargo', 'dependencia', 'fechaInicio', 'fechaFin'];
  dataSourceDoc = new MatTableDataSource<ContratoDetalle>(this.cDo);
  @ViewChild(MatPaginator) paginatorDoc!: MatPaginator;

  
  modalDatos = viewChild.required(AddContratoModalComponent);//
  modalFin=viewChild.required(FinalizaContratoComponent);

  constructor(private route: ActivatedRoute,  private sanitizer: DomSanitizer) { }
  
  ngOnInit(): void 
  {
    this.route.params.subscribe(params => {
      this.trabajadorId = params['id'];
    }); 

    this.getDetalleContratos();
  }

  getDetalleContratos()
  {
    this.trabajadorService.getDetalleContratos(this.trabajadorId).subscribe({
      next:(res)=>{
        console.log(res);
        if(res.status==ResultEnum.Success)
        {
          this.detalleTrabajadorContrato.set(res.data);

          res.data.contratos.forEach((contrato)=>
          {
            if(contrato.activo==true)
              this.cA.push(contrato);
            else if(contrato.activo==false)
            {
              if(contrato.idTipoTrabajador==2)
                this.cDo.push(contrato);
              else this.cAd.push(contrato);
            }
            
          });

          this.contratosActivos.set(this.cA);
          this.contratosAdmin.set(this.cAd);
          this.contratosDoc.set(this.cDo);

          this.dataSource.paginator = this.paginator;
          this.dataSourceDoc.paginator = this.paginatorDoc;
        }
        else{
          Swal.fire({
            title: 'Advertencia!',
            html: '<p>'+res.message+'.</p>',
            icon: 'warning',
            confirmButtonText: 'Ok',
            ...this.sweetalert.theme,
          })
        }
      }

    })
    
  }


  openModalDatos()
  {
    this.modalDatos().openModal(this.trabajadorId);
  }

  openFinalizaContrato(contratoId:number)
  {
    this.modalFin().openFinModal(contratoId);
  }

  actualizarPagina(input:boolean)
  {
    this.actualizar=input;
    
    this.getDetalleContratos();
    location.reload();
  }

}
