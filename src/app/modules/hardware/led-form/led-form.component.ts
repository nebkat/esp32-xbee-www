import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { GpioSelectDialogComponent } from "@modules/hardware/gpio-select/gpio-select-dialog.component";

@Component({
  selector: 'app-led-form',
  templateUrl: './led-form.component.html',
  styleUrls: ['./led-form.component.scss']
})
export class LedFormComponent implements OnInit {
  ledChipsets = ledChipsets;
  ledSpiChipsets = ledSpiChipsets;
  ledRgbOrders = ledRgbOrders;

  GpioDialogComponent = GpioSelectDialogComponent;

  @Input() data: Partial<LedData>;
  @Output() dataChange: EventEmitter<LedData> = new EventEmitter();

  form = this.fb.group({
    name: [],
    type: ['simple', Validators.required],
    simple: this.fb.group({
      pin: [null, Validators.required]
    }),
    channels: this.fb.group({
      redPin: [null, Validators.required],
      greenPin: [null, Validators.required],
      bluePin: [null, Validators.required]
    }),
    strip: this.fb.group({
      chipset: ['ws2812', Validators.required],
      rgbOrder: ['rgb', Validators.required],
      stripLength: [1, [
        Validators.required,
        Validators.min(1),
        Validators.max(1024),
        Validators.pattern(/^\d+$/)
      ]],
      dataPin: [null, Validators.required],
      clockPin: [null, Validators.required]
    })
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form.patchValue(this.data);
    this.form.valueChanges.subscribe(value => {
      if (this.form.valid) this.dataChange.emit(value);

      switch (this.form.controls['type'].value) {
        case 'simple':
          this.form.controls['simple'].enable({emitEvent: false});
          this.form.controls['channels'].disable({emitEvent: false});
          this.form.controls['strip'].disable({emitEvent: false});
          break;
        case 'channels':
          this.form.controls['simple'].disable({emitEvent: false});
          this.form.controls['channels'].enable({emitEvent: false});
          this.form.controls['strip'].disable({emitEvent: false});
          break;
        case 'strip':
          this.form.controls['simple'].disable({emitEvent: false});
          this.form.controls['channels'].disable({emitEvent: false});
          this.form.controls['strip'].enable({emitEvent: false});
          break;
      }

      if (ledSpiChipsets.includes(this.form.get(['strip', 'chipset']).value)) {
        this.form.get(['strip', 'clockPin']).enable({emitEvent: false});
      } else {
        this.form.get(['strip', 'clockPin']).disable({emitEvent: false});
      }
    });
  }
}

export interface LedData {
  name: string;
  type: LedType;
}

export const ledChipsets = ['apa102', 'dotstar', 'ge8822', 'gw6205', 'lpd1886', 'lpd8806', 'p9813', 'pl9823', 'sk6812', 'sk6822', 'sk9822', 'sm16703', 'sm16716', 'tm1803', 'tm1809', 'tm1829', 'ucs1903', 'ucs1903b', 'ucs1904', 'ucs2903', 'ws2801', 'ws2803', 'ws2811', 'ws2812', 'ws2813'];
export const ledSpiChipsets = ['apa102', 'dotstar', 'lpd8806', 'p9813', 'sk9822', 'sm16716', 'ws2801', 'ws2803'];
export type LedChipset = 'apa102' | 'dotstar' | 'ge8822' | 'gw6205' | 'lpd1886' | 'lpd8806' | 'p9813' | 'pl9823' | 'sk6812' | 'sk6822' | 'sk9822' | 'sm16703' | 'sm16716' | 'tm1803' | 'tm1809' | 'tm1829' | 'ucs1903' | 'ucs1903b' | 'ucs1904' | 'ucs2903' | 'ws2801' | 'ws2803' | 'ws2811' | 'ws2812' | 'ws2813';

export const ledRgbOrders = ['rgb', 'rbg', 'brg', 'bgr', 'grb', 'gbr'];
export type LedRgbOrder = 'rgb' | 'rbg' | 'brg' | 'bgr' | 'grb' | 'gbr';

export type LedType = 'simple' | 'channels' | 'strip';
