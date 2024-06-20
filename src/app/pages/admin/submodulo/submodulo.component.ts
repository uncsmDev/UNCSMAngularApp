import { Component, Signal, WritableSignal, computed, inject, signal,AfterViewInit, ViewChild, AfterContentInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import type { InstanceOptions } from 'flowbite';
import { TitleComponent } from '../../../shared/title/title.component';

@Component({
  selector: 'app-submodulo',
  standalone: true,
  imports: [TitleComponent],
  templateUrl: './submodulo.component.html',
  styleUrl: './submodulo.component.css'
})
export default class SubmoduloComponent {

}
