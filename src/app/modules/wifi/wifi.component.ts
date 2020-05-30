import { Component, OnInit } from '@angular/core';
import { WifiConfig } from "@modules/wifi/wifi.service";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-wifi',
  templateUrl: './wifi.component.html',
  styleUrls: ['./wifi.component.scss']
})
export class WifiComponent implements OnInit {
  data: WifiConfig = {
    ap: {
      enabled: true,
      ssid: 'TEST',
      hidden: false,
      key: undefined,
      ip: {
        gw: 0xc0a80401,
        mask: 0xffffff00
      }
    },
    sta: [
      {
        ssid: 'Blok2',
        security: 'WPA/2_PSK'
      },
      {
        ssid: 'TEST',
        security: 'OPEN'
      },
      {
        ssid: 'Blok5',
        security: 'OPEN',
        bssid: 187723572702975
      },
      {
        ssid: 'ALALALA',
        security: 'WPA2_ENTERPRISE',
        hidden: true
      }
    ]
  }

  constructor(private dialog: MatDialog) {

  }

  ngOnInit(): void {
  }

}
