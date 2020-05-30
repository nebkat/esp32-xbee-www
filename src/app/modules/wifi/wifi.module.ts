import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "@shared/shared.module";
import { WifiComponent } from "@modules/wifi/wifi.component";
import { AccessPointConfigComponent } from './access-point-config/access-point-config.component';
import { StationConfigComponent } from './station-config/station-config.component';
import { WifiAuthModeNamePipe } from './wifi-auth-mode-name.pipe';
import { StationApConfigDialogComponent } from './station-ap-config-dialog/station-ap-config-dialog.component';

@NgModule({
  declarations: [WifiComponent, AccessPointConfigComponent, StationConfigComponent, WifiAuthModeNamePipe, StationApConfigDialogComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [WifiComponent]
})
export class WifiModule { }
