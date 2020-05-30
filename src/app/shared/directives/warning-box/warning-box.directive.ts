import { Directive } from '@angular/core';

@Directive({
  selector: '[appWarningBox]',
  host: {
    'class': 'warning-box'
  }
})
export class WarningBoxDirective {
  constructor() { }
}
