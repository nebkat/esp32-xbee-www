import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpioSelectDialogComponent } from './gpio-select/gpio-select-dialog.component';
import { HardwareComponent } from "./hardware.component";
import { SharedModule } from "@shared/shared.module";
import { UartFormComponent } from "@modules/hardware/uart-form/uart-form.component";
import { LedFormComponent } from "@modules/hardware/led-form/led-form.component";
import { LedColorPickerComponent } from './led-color-picker/led-color-picker.component';

@NgModule({
  declarations: [GpioSelectDialogComponent, HardwareComponent, LedFormComponent, UartFormComponent, LedColorPickerComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class HardwareModule { }
