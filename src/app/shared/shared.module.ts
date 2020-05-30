import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "./material.module";
import { MarkdownModule } from "ngx-markdown";
import { FlexLayoutModule } from "@angular/flex-layout";
import { IconsModule } from "@shared/icons.module";
import { DialogSelectModule } from "@shared/components/dialog-select/dialog-select.module";
import { IpAddressInputModule } from "@shared/components/ip-address-input/ip-address-input.module";
import { Mac48Pipe } from './pipes/mac48.pipe';
import { AlertDialogModule } from "@shared/components/alert-dialog/alert-dialog.module";
import { WarningBoxModule } from '@shared/directives/warning-box/warning-box.module';
import { MacAddressInputModule } from "@shared/components/mac-address-input/mac-address-input.module";

@NgModule({
  declarations: [Mac48Pipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    FlexLayoutModule,

    MarkdownModule.forRoot()
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    FlexLayoutModule,

    MaterialModule,
    IconsModule,

    MarkdownModule,

    DialogSelectModule,
    IpAddressInputModule,
    MacAddressInputModule,
    AlertDialogModule,
    WarningBoxModule,

    Mac48Pipe
  ]
})
export class SharedModule { }
