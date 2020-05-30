import { Component, OnInit } from '@angular/core';
import { LedData } from "./led-form/led-form.component";
import { UartData } from "./uart-form/uart-form.component";

@Component({
  selector: 'app-hardware',
  templateUrl: './hardware.component.html',
  styleUrls: ['./hardware.component.scss']
})
export class HardwareComponent implements OnInit {
  data: HardwareData = {
    uarts: [{
      number: 1,
      enabled: true,
      pins: {
        tx: 1,
        rx: 3,
        rts: null,
        cts: null
      },
      data: {
        baudRate: 115200,
        dataBits: 8,
        stopBits: 1,
        parity: null
      }
    }, {
      number: 2,
      enabled: false
    }, {
      number: 3,
      enabled: false
    }],
    leds: [{
      name: 'Test',
      type: 'strip'
    }]
  };

  constructor() { }

  ngOnInit(): void {
  }

}

export interface HardwareData {
  uarts: Partial<UartData>[];
  leds: Partial<LedData>[];
}
