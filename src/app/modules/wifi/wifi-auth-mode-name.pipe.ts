import { Pipe, PipeTransform } from '@angular/core';
import { WifiAuthMode } from "@modules/wifi/wifi.service";

@Pipe({
  name: 'wifiAuthModeName'
})
export class WifiAuthModeNamePipe implements PipeTransform {
  transform(value: WifiAuthMode): string {
    switch(value) {
      case "OPEN": return "Open";
      case "WEP": return "WEP";
      case "WPA_PSK": return "WPA-PSK";
      case "WPA2_PSK": return "WPA2-PSK";
      case "WPA/2_PSK": return "WPA/2-PSK";
      case "WPA2_ENTERPRISE": return "WPA2 Enterprise";
      case "WPA3_PSK": return "WPA3-PSK";
      default: return "Unknown";
    }
  }
}
