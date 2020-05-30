import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from "@app/core.module";
import { SharedModule } from "@shared/shared.module";
import { AdminModule } from "@modules/admin/admin.module";
import { HardwareModule } from "@modules/hardware/hardware.module";
import { HomeModule } from "@modules/home/home.module";
import { LogsModule } from "@modules/logs/logs.module";
import { ProtocolsModule } from "@modules/protocols/protocols.module";
import { RoutingModule } from "@modules/routing/routing.module";
import { UpdatesModule } from "@modules/updates/updates.module";
import { WifiModule } from "@modules/wifi/wifi.module";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    CoreModule,
    SharedModule,

    AppRoutingModule,

    BrowserAnimationsModule,

    HttpClientModule,

    AdminModule,
    HardwareModule,
    HomeModule,
    LogsModule,
    ProtocolsModule,
    RoutingModule,
    UpdatesModule,
    WifiModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
