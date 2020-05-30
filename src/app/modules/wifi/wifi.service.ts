import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class WifiService {
  constructor(private http: HttpClient) { }

  getConfig(): Observable<WifiConfig> {
    return this.http.get<WifiConfig>('/config/wifi');
  }

  saveConfig(config: WifiConfig): Observable<WifiConfig> {
    return this.http.post<WifiConfig>('/config/wifi', config);
  }

  scanStations(): Observable<WifiStaApInfo[]> {
    const scanned: WifiStaApInfo[] = [
      {
        ssid: 'Blok2',
        bssid: 'FF:EE:DD:CC:BB:AA',
        authmode: 'WPA/2_PSK',
        wps: false,
        rssi: -30,
        channel: 6
      },
      {
        ssid: 'TEST',
        bssid: '0A:B3:D1:00:AF:CC',
        authmode: 'OPEN',
        wps: false,
        rssi: -60,
        channel: 2
      }
    ].map(a => [Math.random(), a] as [number, any])
      .sort((a, b) => a[0] - b[0])
      .map(a => a[1]);

    return of(scanned).pipe(delay(1000));
    //return this.http.get<WifiStaInfo[]>('/wifi/scan');
  }
}

/** WiFi authentication modes */
export type WifiAuthMode = 'OPEN' | 'WEP' | 'WPA_PSK' | 'WPA2_PSK' | 'WPA/2_PSK' | 'WPA2_ENTERPRISE' | 'WPA3_PSK';
export const wifiAuthModes: WifiAuthMode[] = ['OPEN', 'WEP', 'WPA_PSK', 'WPA2_PSK', 'WPA/2_PSK', 'WPA2_ENTERPRISE', 'WPA3_PSK'];

/** WiFi configuration */
export interface WifiConfig {
  ap: WifiApConfig;
  sta: WifiStaApConfig[];
}

/** WiFi access point configuration */
export interface WifiApConfig {
  enabled: boolean;

  ssid: string;
  channel?: number;
  key?: string;
  hidden: boolean;

  ip?: Omit<IpConfig, 'ip'>;
}

/** WiFi station AP info */
export interface WifiStaApInfo {
  ssid: string;
  bssid: number;
  rssi: number;
  channel: number;
  security: WifiAuthMode;
  wps: boolean;
}

/** WiFi station AP configuration */
export interface WifiStaApConfig {
  ssid: string;
  bssid?: number;
  security: WifiAuthMode;
  key?: string;
  hidden?: boolean;

  ip?: IpConfig;
  dns?: DnsConfig;

  allocatedIp?: IpConfig;
  allocatedDns?: DnsConfig;
}

/** IP configuration */
export interface IpConfig {
  ip: number;
  mask: number;
  gw: number;
}

/** DNS configuration */
export type DnsConfig = {
  primary: number;
  backup?: number;
  fallback?: number;
};
