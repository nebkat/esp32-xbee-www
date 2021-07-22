import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WifiComponent } from "@modules/wifi/wifi.component";
import { AdminComponent } from "./modules/admin/admin.component";
import { HardwareComponent } from "@modules/hardware/hardware.component";
import { ProtocolsComponent } from "@modules/protocols/protocols.component";
import { RoutingComponent } from "@modules/routing/routing.component";
import { UpdatesComponent } from "@modules/updates/updates.component";
import { LogsComponent } from "@modules/logs/logs.component";
import { HomeComponent } from "@modules/home/home.component";

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'admin', component: AdminComponent },
  { path: 'logs', component: LogsComponent },
  { path: 'wifi', component: WifiComponent },
  { path: 'hardware', component: HardwareComponent },
  { path: 'protocols', component: ProtocolsComponent },
  { path: 'routing', component: RoutingComponent },
  { path: 'updates', component: UpdatesComponent },
  { path: '**',   redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
