import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarningBoxDirective } from './warning-box.directive';

@NgModule({
  declarations: [WarningBoxDirective],
  exports: [
    WarningBoxDirective
  ],
  imports: [
    CommonModule
  ]
})
export class WarningBoxModule { }
