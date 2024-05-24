import { Component, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { UsuarioService } from '../../Services/usuario.service';
import { UsuarioViewModel } from '../../interfaces/usuario';
import type { InstanceOptions } from 'flowbite';


@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export default class UsuariosComponent {
  userService =inject(UsuarioService);

  usuarios:WritableSignal<UsuarioViewModel[]>=signal([]);
  usuarioList:Signal<UsuarioViewModel[]>=computed(this.usuarios);

  constructor()
  {

  }


  ngOnInit(): void {
    initFlowbite();
    this.userService.get()
    .subscribe({
      next: (res)=> {
        const users=res.map(item=>({
          id:item.id,
          nombres:item.nombres,
          apellidos:item.apellidos,
          email:item.email,
          cargo:item.cargo
        }));

        this.usuarios.set(users);
        console.log(this.usuarios());
        console.log(this.usuarioList());
      },
      error: (error) =>{
        console.error("Error", error);
      }
    });
  }
}
