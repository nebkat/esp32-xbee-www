import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { GpioNumber, GpioService } from "../gpio.service";
import { MatSelect } from "@angular/material/select";
import { GpioSelectDialogComponent } from "../gpio-select/gpio-select-dialog.component";

@Component({
  selector: 'app-uart-form',
  templateUrl: './uart-form.component.html',
  styleUrls: ['./uart-form.component.scss']
})
export class UartFormComponent implements OnInit, OnChanges {
  GpioDialogComponent = GpioSelectDialogComponent;

  @Input() data: Partial<UartData>;
  @Output() dataChange: EventEmitter<UartData> = new EventEmitter();

  requiredPins = [{
    name: 'tx',
    title: 'TX',
    required: true
  }, {
    name: 'rx',
    title: 'RX',
    required: true
  }, {
    name: 'rts',
    title: 'RTS',
    required: false
  }, {
    name: 'cts',
    title: 'CTS',
    required: false
  }];

  form = this.fb.group({
    number: [null],
    name: [null, Validators.required],
    enabled: [true],
    pins: this.fb.group({
      tx: [null],//, this.gpioService.validator(GpioAllocations.forUart(this.data.number, 'tx'), true, {write: true})],
      rx: [null],//, this.gpioService.validator(GpioAllocations.forUart(this.data.number, 'rx'), true, {write: true})],
      rts: [null],//, this.gpioService.validator(GpioAllocations.forUart(this.data.number, 'rts'), true, {write: true})],
      cts: [null],//, this.gpioService.validator(GpioAllocations.forUart(this.data.number, 'cts'), true, {write: true})]
    }),
    data: this.fb.group({
      baudRate: [null, [
        Validators.required,
        Validators.min(1),
        Validators.max(5000000),
        Validators.pattern(/^\d+$/)
      ]],
      dataBits: [null, Validators.required],
      stopBits: [null, Validators.required],
      parity: [null]
    })
  });

  constructor(public gpioService: GpioService, private fb: FormBuilder) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.form.patchValue(this.data, {emitEvent: false});
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe(value => {
      if (this.form.valid) this.dataChange.emit(value);

      if (!this.form.controls['enabled'].value) {
        this.form.disable({emitEvent: false});

        // Re-enable toggle (after form disabled)
        this.form.controls['enabled'].enable({emitEvent: false});
      } else {
        this.form.enable({emitEvent: false});
      }
    });
    this.form.patchValue(this.data);
  }
}

export interface UartData {
  number: 1 | 2 | 3;
  name: string;
  enabled: boolean;
  pins: {
    tx: GpioNumber;
    rx: GpioNumber;
    rts: GpioNumber;
    cts: GpioNumber;
  },
  data: {
    baudRate: number;
    dataBits: 5 | 6 | 7 | 8;
    stopBits: 1 | 1.5 | 2;
    parity: null | 'odd' | 'even';
  }

}
