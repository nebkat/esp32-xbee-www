import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

const g = (g: Partial<GpioFeatures>): GpioFeatures => Object.assign({
  readonly: false,
  adc: false,
  dac: false
}, g) as GpioFeatures;

export type GpioNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 21 | 22 | 23 | 25 | 26 | 27 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39;
export type GpioList = GpioNumber[];
export const GPIO_LIST: GpioList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 25, 26, 27, 32, 33, 34, 35, 36, 37, 38, 39];
export const GPIO_FEATURES: {[key in GpioNumber]: GpioFeatures} = {
    0: g({adc: true}),
    1: g({}),
    2: g({adc: true}),
    3: g({}),
    4: g({adc: true}),
    5: g({}),
    6: g({}),
    7: g({}),
    8: g({}),
    9: g({}),
    10: g({}),
    11: g({}),
    12: g({adc: true}),
    13: g({adc: true}),
    14: g({adc: true}),
    15: g({adc: true}),
    16: g({}),
    17: g({}),
    18: g({}),
    19: g({}),
    21: g({}),
    22: g({}),
    23: g({}),
    25: g({adc: true, dac: true}),
    26: g({adc: true, dac: true}),
    27: g({adc: true}),
    32: g({adc: true}),
    33: g({adc: true}),
    34: g({readonly: true, adc: true}),
    35: g({readonly: true, adc: true}),
    36: g({readonly: true, adc: true}),
    37: g({readonly: true, adc: true}),
    38: g({readonly: true, adc: true}),
    39: g({readonly: true, adc: true}),
};

const HARDWARE_GPIOS_ESP32_WROOM: GpioList = [0, 1, 2, 3, 4, 5, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 25, 26, 27, 32, 33, 34, 35, 36, 39];
const HARDWARE_GPIOS_ESP32_XBEE: GpioList = [0, 1, 3, 4, 13, 14, 16, 17, 18, 19, 25, 26, 27, 32, 33, 34, 36, 39];

@Injectable({
  providedIn: 'root'
})
export class GpioService {
  available: GpioList = GPIO_LIST;
  allocations: {[key in GpioNumber]?: GpioAllocation} = {};

  constructor() { }

  validator(allocation: GpioAllocation, required: boolean, {write = true, adc = false, dac = false}: {write?: boolean, adc?: boolean, dac?: boolean}): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = Number(control.value) as GpioNumber;
      if (isNaN(value)) return required ? {'required': true} : null;
      if (!GPIO_LIST.includes(value)) return {'gpio': 'invalid'};
      if (!this.available.includes(value)) return {'gpio': 'unavailable'};

      const features = GPIO_FEATURES[value];
      if (write && features.readonly) return {'gpio': 'readonly'};
      if (adc && !features.adc) return {'gpio': 'adc'};
      if (dac && !features.dac) return {'gpio': 'dac'};

      if (this.allocations[value] != allocation) return {'gpio': 'allocated'};

      return null;
    }
  }
}

export interface GpioFeatures {
  number: number;
  readonly: boolean;
  dac: boolean;
  adc: boolean;
}

export interface GpioAllocation {
  category: 'uart' | 'led';
}

export interface GpioAllocationUart extends GpioAllocation {
  category: 'uart';
  number: number;
  pin: 'tx' | 'rx' | 'rts' | 'cts';
}

export interface GpioAllocationLed extends GpioAllocation {
  category: 'led';
  id: string;
  pin: 'led' | 'r' | 'g' | 'b' | 'data';
}

export namespace GpioAllocations {
  export function forUart(number: number, pin: 'tx' | 'rx' | 'rts' | 'cts'): GpioAllocationUart {
    return {
      category: 'uart',
      number: number,
      pin: pin
    }
  }
}
