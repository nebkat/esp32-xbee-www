import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogSelectComponent, DialogSelectTrigger } from '@shared/components/dialog-select/dialog-select';

@NgModule({
  declarations: [DialogSelectComponent, DialogSelectTrigger],
  imports: [
    CommonModule
  ],
  exports: [DialogSelectComponent, DialogSelectTrigger]
})
export class DialogSelectModule { }
