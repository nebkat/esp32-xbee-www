import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "@shared/shared.module";
import { RoutingComponent } from "@modules/routing/routing.component";

@NgModule({
  declarations: [RoutingComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [RoutingComponent]
})
export class RoutingModule { }
