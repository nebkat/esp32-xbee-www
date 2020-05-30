import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogsComponent } from "./logs.component";
import { SharedModule } from "@shared/shared.module";

@NgModule({
  declarations: [LogsComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [LogsComponent]
})
export class LogsModule { }
