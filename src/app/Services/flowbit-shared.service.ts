import { Injectable } from '@angular/core';
import { InstanceOptions, Popover, PopoverInterface, PopoverOptions} from 'flowbite';

@Injectable({
  providedIn: 'root'
})
export class FlowbitSharedService {

  constructor() { }
  popper(buttonName:string, placement: "top"|"right"|"bottom"|"left"){

    const $targetEl: HTMLElement = document.getElementById('popoverContent') as HTMLElement;
  
    // set the element that trigger the popover using hover or click
    const $triggerEl: HTMLElement = document.getElementById(buttonName) as HTMLElement;
  
    const options: PopoverOptions = {
      placement: placement,
      triggerType: 'hover',
      offset: 10,
      onHide: () => {
          console.log('popover is shown');
      },
      onShow: () => {
          console.log('popover is hidden');
      },
      onToggle: () => {
          console.log('popover is toggled');
      },
  };
    console.log('Entra')
    const instanceOptions: InstanceOptions = {
      id: 'popoverContent',
      override: true
    };
  
    console.log($targetEl);
    
    if ($targetEl) {
        /*
         * targetEl: required
         * triggerEl: required
         * options: optional
         * instanceOptions: optional
         */
        const popover: PopoverInterface = new Popover(
            $targetEl,
            $triggerEl,
            options,
            instanceOptions
        );
    
        popover.show();
    }
  }
}
