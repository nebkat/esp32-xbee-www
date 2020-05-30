import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "@shared/shared.module";
import { UpdatesComponent } from "@modules/updates/updates.component";

@NgModule({
  declarations: [UpdatesComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [UpdatesComponent]
})
export class UpdatesModule { }
