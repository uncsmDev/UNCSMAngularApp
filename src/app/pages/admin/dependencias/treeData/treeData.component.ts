import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

interface FoodNode {
  id: number;
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    id: 1,
    name: 'Rectoría',
    children: [
      { id: 2, name: 'Dirección de Gestión Académica'}, 
      { id: 3, name: 'Dirección de Gestión de la Calidad Institucional'}],
  },
  {
    id: 4,
    name: 'Vice-Rectoría',
    children: [{  id: 5, name: 'División de Desarrollo Tecnológico de la Información y Comunicación'}, 
      { id: 6,name: 'Centro de Biología Molecular'}, 
      { id: 7,name:'Laboratorio de Ingeniería'}]
  },
];

@Component({
    selector: 'app-tree-data',
    imports: [
        CommonModule, MatTreeModule, MatButtonModule, MatIconModule
    ],
    template: `
  <mat-tree #tree [dataSource]="dataSource" [childrenAccessor]="childrenAccessor">
  <!-- This is the tree node template for leaf nodes -->
    <mat-tree-node *matTreeNodeDef="let node" matTreeNodePadding>
      <!-- use a disabled button to provide padding for tree leaf -->
      <button mat-icon-button disabled></button>
      <div class="w-full flex items-center justify-between hover:bg-gray-700 p-2 rounded-lg">
        {{node.name}}
        <div class="flex items-center">
          <a class="mr-2 text-center">
            <svg class="w-6 h-6 text-green-500 hover:text-green-400  dark:text-white cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
          </a>
          <a class="mr-2 text-center">
            <svg class="w-6 h-6 text-yellow-500 hover:text-yellow-400 dark:text-white cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
            </svg>
          </a>
          <a class="mr-4 text-center">
            <svg class="w-6 h-6 text-red-500 hover:text-red-400   dark:text-white cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
            </svg>
          </a>
        </div>
      </div>

    </mat-tree-node>
  <!-- This is the tree node template for expandable nodes -->
  <mat-tree-node *matTreeNodeDef="let node;when: hasChild" matTreeNodePadding [cdkTreeNodeTypeaheadLabel]="node.name">
    <button mat-icon-button matTreeNodeToggle [attr.aria-label]="'Toggle ' + node.name">
      <mat-icon class="mat-icon-rtl-mirror">
        {{tree.isExpanded(node) ? 'expand_more' : 'chevron_right'}}
      </mat-icon>
    </button>
    <div class="w-full flex items-center justify-between hover:bg-gray-700 p-2 rounded-lg">
      {{node.name}}
      <div class="flex items-center">
        <a class="mr-2">
          <svg class="w-6 h-6 text-green-500 hover:text-green-400 text-gray-800 dark:text-white cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
          </svg>
        </a>
        <a class="mr-2">
          <svg class="w-6 h-6 text-yellow-500 hover:text-yellow-400 text-gray-800 dark:text-white cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
          </svg>
        </a>
        <a class="mr-4">
          <svg class="w-6 h-6 text-red-500 hover:text-red-400 text-gray-800 dark:text-white cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
          </svg>
        </a>
      </div>
    </div>
  </mat-tree-node>
  </mat-tree>
`,
    styleUrl: './treeData.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeDataComponent { 

  dataSource = TREE_DATA;


  childrenAccessor = (node: FoodNode) => node.children ?? [];

  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;

}
