import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

import icons from '!!raw-loader!../../assets/icons.svg';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,

    MatIconModule
  ],
  exports: [
    MatIconModule,
  ]
})
export class IconsModule {
  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
    iconRegistry.addSvgIconSetLiteral(sanitizer.bypassSecurityTrustHtml(icons));
  }
}
