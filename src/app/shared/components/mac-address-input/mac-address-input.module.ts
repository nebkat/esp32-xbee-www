import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MacAddressInputComponent,
  MacAddressInputPartDirective
} from '@shared/components/mac-address-input/mac-address-input';
import { FormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";

@NgModule({
  declarations: [MacAddressInputComponent, MacAddressInputPartDirective],
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule
  ],
  exports: [MacAddressInputComponent]
})
export class MacAddressInputModule { }
