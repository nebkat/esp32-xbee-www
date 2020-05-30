import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective, NgForm,
  ValidationErrors,
  Validators
} from "@angular/forms";
import { WifiApConfig } from "@modules/wifi/wifi.service";
import { ErrorStateMatcher } from "@angular/material/core";

@Component({
  selector: 'app-access-point-config',
  templateUrl: './access-point-config.component.html',
  styleUrls: ['./access-point-config.component.scss']
})
export class AccessPointConfigComponent implements OnInit, OnChanges {
  @Input() data: WifiApConfig;
  @Output() dataChange: EventEmitter<WifiApConfig> = new EventEmitter();

  changed = false;

  form = this.fb.group({
    enabled: [true],
    ssid: [null, [Validators.required, Validators.maxLength(32)]],
    hidden: [false],
    key: [null, [Validators.maxLength(64)]],
    ip: this.fb.group({
      gw: [null, Validators.required],
      mask: [this.subnetToMask(24), Validators.required]
    }, {validators: [this.subnetIpValidator]})
  });

  constructor(private fb: FormBuilder, private defaultErrorStateMatcher: ErrorStateMatcher) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.form.patchValue(this.data, {emitEvent: false});
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe(() => {
      this.changed = true;

      if (!this.form.controls['enabled'].value) {
        this.form.disable({emitEvent: false});

        // Re-enable toggle (after form disabled)
        this.form.controls['enabled'].enable({emitEvent: false});
      } else {
        this.form.enable({emitEvent: false});
      }
    });
  }

  onSaveClick() {
    if (this.form.valid) this.dataChange.emit(this.form.value);
    this.changed = false;
  }

  onResetClick() {
    this.form.patchValue(this.data);
    this.changed = false;
  }

  ipToString(ip: number) {
    return `${ip >>> 24}.${ip >> 16 & 255}.${ip >> 8 & 255}.${ip & 255}`;
  }

  subnetToMask(subnet: number) {
    return (0xffffffff << (32 - subnet)) >>> 0;
  }

  get subnetIpRange(): number[] | null {
    const ip: number | null = this.form.get(['ip', 'gw']).value;
    const mask: number | null = this.form.get(['ip', 'mask']).value;
    if (ip === null || mask === null) return null;

    return [((ip & mask) >>> 0) + 1, ((ip | ~mask) >>> 0) - 1];
  }

  subnetIpValidator(group: FormGroup): ValidationErrors | null {
    const ip: number | null = group.get('gw').value;
    const mask: number | null = group.get('mask').value;
    if (ip === null || mask === null) return null;

    return ip === ((ip & mask) >>> 0) || ip === ((ip | ~mask) >>> 0)
      ? {'network': true} : null;
  }

  ipErrorStateMatcher: ErrorStateMatcher = {
    isErrorState: (control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean => {
      return this.defaultErrorStateMatcher.isErrorState(control, form) || form.form.get('ip').invalid;
    }
  }
}
