import { Component, Signal, WritableSignal, computed, inject, signal,AfterViewInit, ViewChild, AfterContentInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { UsuarioService } from '../../Services/usuario.service';
import { UsuarioViewModel, Usuario } from '../../interfaces/usuario';
import {PackPage, Paginacion} from '../../interfaces/packPage'
import type { InstanceOptions } from 'flowbite';

import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})

export default class UsuariosComponent implements AfterContentInit{
  userService =inject(UsuarioService);

  usuarios:WritableSignal<UsuarioViewModel[]>=signal([]);
  usuarioList:Signal<UsuarioViewModel[]>=computed(this.usuarios);
  
  pag!:Paginacion;
  
   constructor()
   {
   
   }



   ngAfterContentInit() {
   
    this.userService.get(0)
    .subscribe({
      next: (res)=> {
        this.pag=res.paginacion;
      },
      error: (error) =>{
        console.error("Error", error);
      }
    });

   }
 
  ngOnInit(): void {
    initFlowbite();
    this.userService.get(0)
    .subscribe({
      next: (res)=> {
        const users=res.listModel.map(item=>({
          id:item.id,
          nombres:item.nombres,
          apellidos:item.apellidos,
          email:item.email,
          cargo:item.cargo
        }));
      
        this.usuarios.set(users);
      
      },
      error: (error) =>{
        console.error("Error", error);
      }
    });
  }


  previousPage()
  {
    debugger;

    if(this.pag.paginasAnteriores==true)
      {
        debugger;
        
        this.userService.get(this.pag.paginaInicio-1)
        .subscribe({
          next: (res)=> {
            this.pag=res.paginacion;

            const users=res.listModel.map(item=>({
              id:item.id,
              nombres:item.nombres,
              apellidos:item.apellidos,
              email:item.email,
              cargo:item.cargo
            }));
          
            this.usuarios.set(users);
          },
          error: (error) =>{
            console.error("Error", error);
          }
        });
      }
  }

  nextPage()
  {
    debugger;

    if(this.pag.paginasPosteriores==true)
      {
        debugger;
        
        this.userService.get(this.pag.paginaInicio+1)
        .subscribe({
          next: (res)=> {
            debugger;
            this.pag=res.paginacion;


            const users=res.listModel.map(item=>({
              id:item.id,
              nombres:item.nombres,
              apellidos:item.apellidos,
              email:item.email,
              cargo:item.cargo
            }));
          
            this.usuarios.set(users);


          },
          error: (error) =>{
            console.error("Error", error);
          }
        });
      }
  }

}
