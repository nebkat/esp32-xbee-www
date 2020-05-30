import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ValidationErrors,
  Validators
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import {wifiAuthModes, WifiStaApConfig, WifiStaApInfo} from '@modules/wifi/wifi.service';

@Component({
  selector: 'app-station-ap-config-dialog',
  templateUrl: './station-ap-config-dialog.component.html',
  styleUrls: ['./station-ap-config-dialog.component.scss']
})
export class StationApConfigDialogComponent implements OnInit {
  wifiAuthModes = wifiAuthModes;

  ssid?: string;
  get result() { return null; }

  scanned = false;

  form = this.fb.group({
    ssid: [null, [Validators.required, Validators.maxLength(32)]],
    hidden: [false],
    security: ['OPEN'],
    key: [null, [Validators.required, Validators.maxLength(64)]],
    enterprise: this.fb.group({
      identity: [null, Validators.required],
      username: [null, Validators.required],
      password: [null, Validators.required],
      certificate: [null, Validators.required]
    }),
    static: [false],
    ip: this.fb.group({
      ip: [null, Validators.required],
      gw: [null, Validators.required],
      mask: [this.subnetToMask(24), Validators.required]
    }, {validators: [this.subnetIpValidator]}),
    dns: this.fb.group({
      primary: [null, Validators.required],
      backup: [null, Validators.required]
    })
  });

  constructor(
    private fb: FormBuilder,
    private defaultErrorStateMatcher: ErrorStateMatcher,
    @Inject(MAT_DIALOG_DATA) data: StationApConfigDialogData) {
    if (data.info !== undefined) {
      this.form.patchValue(data.info);
      this.ssid = data.info.ssid;
      this.scanned = true;
    } else if (data.config !== undefined) {
      this.form.patchValue(data.config);
      this.ssid = data.config.ssid;
    }
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe(() => {
      if (['OPEN', 'WPA2_ENTERPRISE'].includes(this.form.controls['security'].value)) {
        this.form.controls['key'].disable({emitEvent: false});
      } else {
        this.form.controls['key'].enable({emitEvent: false});
      }

      if (this.form.controls['security'].value === 'WPA2_ENTERPRISE') {
        this.form.controls['enterprise'].enable({emitEvent: false});
      } else {
        this.form.controls['enterprise'].disable({emitEvent: false});
      }

      if (this.form.controls['static'].value) {
        this.form.controls['ip'].enable({emitEvent: false});
        this.form.controls['dns'].enable({emitEvent: false});
      } else {
        this.form.controls['ip'].disable({emitEvent: false});
        this.form.controls['dns'].disable({emitEvent: false});
      }
    });
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
      return this.defaultErrorStateMatcher.isErrorState(control, form) || form.form.get('ip').invalid && form.form.get('ip').touched;
    }
  }
}

export interface StationApConfigDialogData {
  info?: WifiStaApInfo,
  config?: WifiStaApConfig
}
