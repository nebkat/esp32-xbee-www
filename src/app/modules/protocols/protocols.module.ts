import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "@shared/shared.module";
import { ProtocolsComponent } from "@modules/protocols/protocols.component";

@NgModule({
  declarations: [ProtocolsComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [ProtocolsComponent]
})
export class ProtocolsModule { }
