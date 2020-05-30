import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IpAddressInputComponent,
  IpAddressInputPartDirective
} from '@shared/components/ip-address-input/ip-address-input';
import { FormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";

@NgModule({
  declarations: [IpAddressInputComponent, IpAddressInputPartDirective],
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule
  ],
  exports: [IpAddressInputComponent]
})
export class IpAddressInputModule { }
